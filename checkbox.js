// alert("AAAAAAAH");
console.log("I'm here!");
$(document).ready(function () {
    const $checkboxWrapper = $("div.stylecheckboxes");
    console.log($checkboxWrapper);

    $checkboxWrapper.find("input[type=checkbox]").on("change", function () {
        if ($checkboxWrapper.find("input[type=checkbox]:checked").length > 3) {
            $(this).prop("checked", false).change();
        }

        if ($checkboxWrapper.find("input[type=checkbox]:checked").length === 3) {
            $checkboxWrapper
                .find("input[type=checkbox]:not(:checked)")
                .closest("label")
                .css({ opacity: "0.5", "pointer-events": "none" });
        } else {
            $checkboxWrapper.find("label").css({ opacity: "", "pointer-events": "" });
        }
    });
});
