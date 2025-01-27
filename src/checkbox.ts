import $ from "jquery";

type Package = {
    name: string;
    price: number;
    styles: number;
};
const packages: Package[] = [
    {
        name: "Starter",
        price: 9,
        styles: 2,
    },
    {
        name: "Grow",
        price: 75,
        styles: 2,
    },
    {
        name: "Scale",
        price: 15000,
        styles: 2,
    },
];

const queryParams = new URLSearchParams(window.location.search);
window.history.replaceState({}, document.title, window.location.pathname);
console.log("I'm here!");
$(() => {
    //remove query params
    // const packageSelect = $("select.packageselect");
    const checkboxWrapper = $("div#styleSelection");
    const packageElements = getPackageElements();

    // console.log($checkboxWrapper);
    // console.log(packageSelect);
    // console.log({ packageElements, $checkboxWrapper: checkboxWrapper });

    //initialize state
    const defaultIndex = parseInt(queryParams.get("pack") || "1", 10);
    let maxOptions = packages[defaultIndex].styles;
    setActivePackage(defaultIndex);

    packageElements.forEach((element, index) => {
        const button = element.find("a");
        element
            .find("#price")
            .find("h2")
            .text(`${packages[index].price.toLocaleString(undefined, { style: "currency", currency: "EUR" })}`);
        element.on("click", function () {
            maxOptions = packages[index].styles;
            const updateStyleAmount = packages[index].styles !== maxOptions;
            setActivePackage(index, updateStyleAmount);
        });
    });

    checkboxWrapper.find("input[type=checkbox]").on("change", function () {
        if (checkboxWrapper.find("input[type=checkbox]:checked").length > maxOptions) {
            $(this).prop("checked", false).change();
        }

        if (checkboxWrapper.find("input[type=checkbox]:checked").length === maxOptions) {
            checkboxWrapper
                .find("input[type=checkbox]:not(:checked)")
                .closest("label")
                .css({ opacity: "0.5", "pointer-events": "none" });
        } else {
            checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
        }
    });
});

function getPackageElements() {
    const [small, medium, large] = [$("div#paketSmall"), $("div#paketMedium"), $("div#paketLarge")];
    return [small, medium, large];
}

function getPaypalButtons() {
    const [small, medium, large] = [$("#paypalSmall"), $("#paypalMedium"), $("#paypalLarge")];
    return [small, medium, large];
}

function showPaypalButton(index: number) {
    const buttons = getPaypalButtons();
    buttons.forEach((button, i) => {
        if (i === index) {
            // button.css({ display: "block" });
            button.show();
        } else {
            // button.css({ display: "none" });
            button.hide();
        }
    });
}

function updatePrices(total: number) {
    const [preTaxText, taxText, totalText] = [$("#pricePreTax"), $("#priceTax"), $("#priceTotal")];
    // console.log({ preTaxText, taxText, totalText });
    const tax = Math.round((total / 119) * 1900) / 100;
    const preTax = total - tax;
    preTaxText.text(`${preTax.toFixed(2)} €`);
    taxText.text(`${tax.toFixed(2)} €`);
    totalText.text(`${total.toFixed(2)} €`);
}

function setStyleTitle(index: number) {
    const styleTitle = $("#styleSelectTitle");
    const currentText = styleTitle.text();
    const targetStyleCount = packages[index].styles;
    //Replace 1-3 Style(s) with the current style amount. include the s if there is more than one style
    const newText = currentText.replace(/\d+ Style(s)*/, `${targetStyleCount} Style${targetStyleCount > 0 ? "s" : ""}`);
    styleTitle.text(newText);
}

function setActivePackage(index: number, updateStyleAmount = true) {
    const packageElements = getPackageElements();
    Object.values(packageElements).forEach((element) => element.removeClass("active"));
    packageElements[index].addClass("active");
    if (updateStyleAmount) {
        const checkboxWrapper = $("div#styleSelection");
        checkboxWrapper.find("input[type=checkbox]").prop("checked", false);
        checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
        setStyleTitle(index);
    }
    updatePrices(packages[index].price);
    showPaypalButton(index);
}
