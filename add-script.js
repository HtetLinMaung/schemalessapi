// const { default: http } = require("starless-http");

// async function main() {
//   const script = (async (context) => {
//     const moment = context.modules["moment"];
//     const { v4 } = require("uuid");
//     return {
//       body: {
//         id: v4(),
//         now: moment(),
//       },
//     };
//   }).toString();

//   const [res, err] = await http.put(
//     "http://localhost:3000/schemalessapi/api/Script/6388b9a816dbbe611218393b",
//     {
//       name: "generate-uuid",
//       description: "Generate uuid version 4",
//       script,
//       scriptType: "inline",
//     }
//   );
//   if (err) {
//     console.log(err);
//   }
//   console.log(res);
// }

// main();
