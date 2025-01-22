import $ from "jquery";

const totalPrices = [50, 100, 150];

console.log("I'm here!");
$(() => {
    // const packageSelect = $("select.packageselect");
    const checkboxWrapper = $("div#styleSelection");
    const packageElements = getPackageElements();

    // console.log($checkboxWrapper);
    // console.log(packageSelect);
    // console.log({ packageElements, $checkboxWrapper: checkboxWrapper });

    //initialize state
    const defaultIndex = 1;
    let maxOptions = defaultIndex + 1;
    setActivePackage(defaultIndex);

    packageElements.forEach((element, index) => {
        const button = element.find("a");

        element.on("click", function () {
            maxOptions = index + 1;
            setActivePackage(index);
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
    //Replace 1-3 Style(s) with the current style amount. include the s if there is more than one style
    const newText = currentText.replace(
        /\d+ Style(s)*/,
        `${index + 1} Style${index > 0 ? "s" : ""}`,
    );
    styleTitle.text(newText);
}

function setActivePackage(index: number) {
    const packageElements = getPackageElements();
    Object.values(packageElements).forEach((element) => element.removeClass("active"));
    packageElements[index].addClass("active");
    const checkboxWrapper = $("div#styleSelection");
    checkboxWrapper.find("input[type=checkbox]").prop("checked", false);
    checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
    updatePrices(totalPrices[index]);
    showPaypalButton(index);
    setStyleTitle(index);
}
