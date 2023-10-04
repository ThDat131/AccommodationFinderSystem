const VNDCurrencyFormat = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
})

function decodeHtmlEntities(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

export { VNDCurrencyFormat, decodeHtmlEntities }