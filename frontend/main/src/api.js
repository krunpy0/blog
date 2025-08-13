export async function checkUser() {
  const res = await fetch("http://localhost:3000/me", {
    credentials: "include",
  });
  if (res.ok) {
    console.log(await res.json());
    return await res.json();
  }
  return res.ok;
}
export async function checkSomeThingElse() {
  return "yeah";
}
