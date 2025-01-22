import $ from "jquery";

console.log("I'm here!");
$(() => {
    // const packageSelect = $("select.packageselect");
    const $checkboxWrapper = $("div:has(#styleSelectTitle)");
    const packageElements = getPackageElements();
    const checkoutTotal = $("div#checkoutTotal");

    // console.log($checkboxWrapper);
    // console.log(packageSelect);

    let maxOptions = 1;

    packageElements.small.on("click", function () {
        maxOptions = 1;
        $checkboxWrapper.find("input[type=checkbox]").prop("checked", false);
        $checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
    });

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
