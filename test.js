const { default: http } = require("starless-http");

async function main() {
  const script = ((context) => {
    for (let i = 0; i < 10000; i++) {
      context.res = { body: { i } };
    }
  }).toString();

  const [res, err] = await http.post(
    "http://localhost:3000/schemalessapi/api/Script",
    {
      script,
      scriptType: "inline",
    }
  );
  if (err) {
    console.log(err);
  }
  console.log(res);
}

main();
