import css from "../../styles/tokens.css?raw";

export const GET = () =>
  new Response(css, {
    headers: { "Content-Type": "text/css; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
