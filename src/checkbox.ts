import $ from "jquery";

const totalPrices = [50, 100, 150];

console.log("I'm here!");
$(() => {
    // const packageSelect = $("select.packageselect");
    const $checkboxWrapper = $("div:has(#styleSelectTitle)");
    const packageElements = getPackageElements();
    const checkoutTotal = $("div#checkoutTotal");

    // console.log($checkboxWrapper);
    // console.log(packageSelect);
    console.log({ packageElements, $checkboxWrapper });

    let maxOptions = 1;

    [packageElements.small, packageElements.medium, packageElements.large].forEach(
        (element, index) => {
            const button = element.find("a");

            element.on("click", function () {
                maxOptions = index + 1;
                console.log("Paket", index + 1);
                const price = totalPrices[index];
                updatePrices(price);
                $checkboxWrapper.find("input[type=checkbox]").prop("checked", false);
                $checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
                Object.values(packageElements).forEach((element) =>
                    element.removeClass("paketAktiv"),
                );
                element.addClass("paketAktiv");
            });
        },
    );

    $checkboxWrapper.find("input[type=checkbox]").on("change", function () {
        if ($checkboxWrapper.find("input[type=checkbox]:checked").length > maxOptions) {
            $(this).prop("checked", false).change();
        }

        if ($checkboxWrapper.find("input[type=checkbox]:checked").length === maxOptions) {
            $checkboxWrapper
                .find("input[type=checkbox]:not(:checked)")
                .closest("label")
                .css({ opacity: "0.5", "pointer-events": "none" });
        } else {
            $checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
        }
    });
});

function getPackageElements() {
    const [small, medium, large] = [$("div#paketSmall"), $("div#paketMedium"), $("div#paketLarge")];
    return { small, medium, large };
}

function updatePrices(total: number) {
    const [preTaxText, taxText, totalText] = [$("#pricePreTax"), $("#priceTax"), $("#priceTotal")];
    console.log({ preTaxText, taxText, totalText });
    const tax = Math.round((total / 119) * 1900) / 100;
    const preTax = total - tax;
    preTaxText.text(preTax);
    taxText.text(tax);
    totalText.text(total);
}
