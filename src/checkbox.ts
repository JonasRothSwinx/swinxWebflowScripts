import $ from "jquery";

const totalPrices = [50, 100, 150];

console.log("I'm here!");
$(() => {
    // const packageSelect = $("select.packageselect");
    const checkboxWrapper = $("div#styleSelection");
    const styleSelectTitle = checkboxWrapper.find("#styleSelectTitle");
    const packageElements = getPackageElements();
    const checkoutTotal = $("div#checkoutTotal");
    const paypalButtons = getPaypalButtons();

    // console.log($checkboxWrapper);
    // console.log(packageSelect);
    console.log({ packageElements, $checkboxWrapper: checkboxWrapper });

    //initialize state
    const defaultIndex = 2;
    let maxOptions = 2;
    updatePrices(totalPrices[defaultIndex]);
    paypalButtons.forEach((button) => button.hide());
    paypalButtons[defaultIndex].show();

    [packageElements.small, packageElements.medium, packageElements.large].forEach(
        (element, index) => {
            const button = element.find("a");

            element.on("click", function () {
                maxOptions = index + 1;
                console.log("Paket", index + 1);
                const price = totalPrices[index];
                updatePrices(price);
                checkboxWrapper.find("input[type=checkbox]").prop("checked", false);
                checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });

                Object.values(packageElements).forEach((element) => element.removeClass("active"));
                element.addClass("active");
            });
        },
    );

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
    return { small, medium, large };
}

function getPaypalButtons() {
    const [small, medium, large] = [$("#paypalSmall"), $("#paypalMedium"), $("#paypalLarge")];
    return [small, medium, large];
}

function updatePrices(total: number) {
    const [preTaxText, taxText, totalText] = [$("#pricePreTax"), $("#priceTax"), $("#priceTotal")];
    console.log({ preTaxText, taxText, totalText });
    const tax = Math.round((total / 119) * 1900) / 100;
    const preTax = total - tax;
    preTaxText.text(`${preTax.toFixed(2)} €`);
    taxText.text(`${tax.toFixed(2)} €`);
    totalText.text(`${total.toFixed(2)} €`);
}
