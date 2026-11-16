export async function walk(
  visit: (path: string) => Promise<void>,
): Promise<void> {
  await visit("/step-1");
  await visit("/step-2");
  await visit("/step-3");
  await visit("/step-4");
  await visit("/step-5");
  await visit("/step-6");
  await visit("/step-7");
  await visit("/step-8");
  await visit("/step-9");
  await visit("/step-10");
  await visit("/step-11");
  await visit("/step-12");
  await visit("/step-13");
  await visit("/step-14");
  await visit("/step-15");
  await visit("/step-16");
  await visit("/step-17");
  await visit("/step-18");
  await visit("/step-19");
  await visit("/step-20");
  await visit("/step-21");
  await visit("/step-22");
  await visit("/step-23");
  await visit("/step-24");
  await visit("/step-25");
  await visit("/step-26");
  await visit("/step-27");
  await visit("/step-28");
  await visit("/step-29");
  await visit("/step-30");
  await visit("/step-31");
  await visit("/step-32");
}
