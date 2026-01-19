import glCodes from '../data/gl_codes.json';

export const EVENT_MAPPING = {
    "Order Shipped": "FIRST_ITEM_SHIPPED",
    "Refunds": "REFUNDS",
    "Replacements": "REPLACEMENTS",
    "Change Installer": "INSTALLER_CHANGE",
    "Change Product": "PRODUCT_CHANGE"
};

export function filterGLCodes(settings) {
    const {
        marketplace,
        event, // User facing event name (e.g. "Order Shipped")
        product,
        paymentType,
        atdSupplied,
        vip,
        platformFee,
        orderType,
        discounts
    } = settings;

    const mappedEvent = EVENT_MAPPING[event] || "";

    return glCodes.filter(row => {
        // 1. Marketplace Match
        if (row.Marketplace !== marketplace) return false;

        // 2. Event Match
        if (row.Event !== mappedEvent) return false;

        // 3. Notes Match (Complex Logic)
        // Formula: (Common) + (Product) + (PaymentType) + (VIP) + (PlatformFee) + (OrderType) + (Discounts) + (ATD)
        const note = row.Notes;

        if (note === "Common") return true;
        if (note === product) return true;
        if (note === paymentType) return true;

        if (vip && note === "VIP") return true;

        // PlatformFee: Only if VIP is False AND PlatformFee is True
        if (!vip && platformFee && note === "PlatformFee") return true;

        if (note === orderType) return true;

        if (discounts && note === "Discounts") return true;

        if (atdSupplied && note === `${product}, ATD-supplied`) return true;

        return false;
    });
}

export function calculateAmounts(filteredCodes, inputData) {
    // inputData is array of { glCode, amount, event }
    // Returns array of objects with calculated amount attached

    // Define which events "RETURNS" should match
    const RETURNS_EVENTS = ['INSTALLER_CHANGE', 'PRODUCT_CHANGE', 'REPLACEMENTS'];

    return filteredCodes.map(row => {
        const totalAmount = inputData.reduce((sum, input) => {
            // SUMIFS logic: Match GL Code AND Match Event
            // Note: ODS SUMIFS(Amount, GLCodeRange, CurrentGL, EventRange, CurrentEvent)

            // Loose comparison for GL Code (string vs number)
            const glMatch = String(input.glCode).trim() === String(row["GL Code"]).trim();

            // Event matching with RETURNS alias support
            let eventMatch = false;
            const inputEvent = String(input.event).trim();
            const rowEvent = String(row.Event).trim();

            if (inputEvent === rowEvent) {
                // Direct match
                eventMatch = true;
            } else if (inputEvent === 'RETURNS' && RETURNS_EVENTS.includes(rowEvent)) {
                // "RETURNS" in input data matches any of the three return events
                eventMatch = true;
            }

            if (glMatch && eventMatch) {
                return sum + (parseFloat(input.amount) || 0);
            }
            return sum;
        }, 0);

        // Handle "Debit/Credit" entries - determine based on amount sign
        let recordedValue = row["Recorded Value"];
        if (recordedValue === "Debit/Credit") {
            // Negative amount = Credit (-), Positive amount = Debit (+)
            recordedValue = totalAmount < 0 ? "Credit (-)" : "Debit (+)";
        }

        return {
            ...row,
            calculatedAmount: totalAmount,
            recordedValue: recordedValue  // Use determined value for display
        };
    });
}
