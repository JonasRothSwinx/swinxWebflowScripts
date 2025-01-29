import $ from "jquery";
import { loadScript } from "@paypal/paypal-js";

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
    {
        name: "Test",
        price: 1,
        styles: 2,
        payPalButtonId: "4LBME9CH9HTK4",
    },
];
const paypalArgs = {
    clientId: "BAARHkwWKac6iakiXCQLoiMPwTcPa_Ixc_9l42dab1qa4rcydBMWd0khdE-PV2RNlhOTEKwIX1D8HukekU",
    components: ["hosted-buttons"],
    currency: "EUR",
    disableFunding: "venmo",
};
let paypal;

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
    form.on("submit", async function (event) {
        event.preventDefault();
        const form = $<HTMLFormElement>(this);
        const url = "https://www.paypal.com/cgi-bin/webscr";
        const data = form.serialize();
        form.attr("target", "_blank");
        form.attr("method", "post");
        form.attr("action", url);
        console.log({ data });
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data,
        });
        // form.trigger("submit");
        console.log(response);
    });

    // console.log($checkboxWrapper);
    // console.log(packageSelect);
    // console.log({ packageElements, $checkboxWrapper: checkboxWrapper });

    //initialize state
    const defaultIndex = parseInt(queryParams.get("pack") || "1", 10);
    let maxOptions = packages[defaultIndex].styles;
    setActivePackage(defaultIndex);

    loadScript(paypalArgs).then(async (paypal) => {
        if (!paypal) {
            console.error("paypal not loaded");
            return;
        }
        console.log("paypal loaded", paypal);
        const button = await paypal
            //@ts-ignore
            .HostedButtons({ hostedButtonId: packages[defaultIndex].payPalButtonId })
            .render("#paypal-container-4LBME9CH9HTK4");
        console.log({ button });
        $(button).insertAfter(checkboxWrapper);
        // button.insertAfter(checkboxWrapper);
    });

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
