import $ from "jquery";

type Package = {
    name: string;
    price: number;
    styles: number;
    payPalButtonId: string;
};
const packages: Package[] = [
    {
        name: "Starter",
        price: 9,
        styles: 2,
        payPalButtonId: "6ZDCPESWBTF44",
    },
    {
        name: "Grow",
        price: 75,
        styles: 2,
        payPalButtonId: "VBFPWKTVZ6VVN",
    },
    {
        name: "Scale",
        price: 150,
        styles: 2,
        payPalButtonId: "JD23T65QBSGX2",
    },
];

const queryParams = new URLSearchParams(window.location.search);
window.history.replaceState({}, document.title, window.location.pathname);
console.log("I'm here!");
getPackageElements().forEach((element, index) => {
    element.find("#price").text(
        packages[index].price.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
        })
    );
});
$(() => {
    //remove query params
    // const packageSelect = $("select.packageselect");
    const form = $<HTMLFormElement>("form#citegeist-posts-checkout");
    form.attr("target", "_blank");
    form.attr("method", "post");
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");

    form.find("input").removeAttr("required");
    const checkboxWrapper = $("div#styleSelection");
    const packageElements = getPackageElements();
    packageElements[0].append(`
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="TL8T3PV37CKYA" />
            <input type="hidden" name="currency_code" value="EUR" />
            <input type="image" src="https://www.paypalobjects.com/de_DE/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" title="PayPal – Einfacher und sicherer online bezahlen." alt="Jetzt kaufen" />
        </form>`);
    // const [cmd, hostedButtonId, currencyCode, submitButton] = [
    //     $(`<input type="hidden" name="cmd" value="_s-xclick" />`),
    //     $(`<input type="hidden" name="hosted_button_id" value="TL8T3PV37CKYA" />`),
    //     $(`<input type="hidden" name="currency_code" value="EUR" />`),
    //     $(
    //         `<input
    //         type="image"
    //         src="https://www.paypalobjects.com/de_DE/i/btn/btn_buynowCC_LG.gif"
    //         border="0"
    //         name="submit"
    //         title="PayPal – Einfacher und sicherer online bezahlen."
    //         alt="Kauf Mich!!!"
    //         style={{
    //             width: "100%",
    //             maxWidth: "150px",
    //             height: "auto",
    //             display: "block",
    //             margin: "auto",
    //         }}

    //     />`
    //     ),
    // ];
    // form.append(cmd, hostedButtonId, currencyCode, submitButton);

    form.on("submit", async function (event) {
        event.preventDefault();
        const form = $<HTMLFormElement>(this);
        const url = "https://www.paypal.com/cgi-bin/webscr";
        const data = form.serialize();
        form.attr("target", "blank");
        form.attr("method", "post");
        form.attr("action", url);
        console.log({ data });
        // const response = await fetch(url, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //     body: data,
        // });
        form.trigger("submit");
        // console.log(response);
    });

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
            .text(
                `${packages[index].price.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                })}`
            )
            .show();
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
    const options: Intl.NumberFormatOptions = {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    preTaxText.text(preTax.toLocaleString("de-DE", options));
    taxText.text(tax.toLocaleString("de-DE", options));
    totalText.text(total.toLocaleString("de-DE", options));
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
