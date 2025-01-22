import { Configuration } from "webpack";

import path from "path";

const config: Configuration = {
    entry: "./src/checkbox.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "checkbox.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};

export default config;
