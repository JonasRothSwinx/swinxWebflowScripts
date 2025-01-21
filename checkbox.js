// alert("AAAAAAAH");
console.log("I'm here!");
$(document).ready(function () {
    const packageSelect = $(".packageselect");
    const $checkboxWrapper = $("div.stylecheckboxes");
    console.log($checkboxWrapper);
    console.log(packageSelect);
    let maxOptions = 1;
    packageSelect.on("change", function () {
        console.log("I'm here!");
        const selectedOption = $(this).find("option:selected");
        console.log(selectedOption.data("value"));
        maxOptions = parseInt(selectedOption.data("value"));
        console.log({ maxOptions, optionValue: selectedOption.data("value") });
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
