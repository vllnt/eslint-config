type Project = {
  name: string;
  use: { viewport: { height: number; width: number } };
};

const projects: Project[] = [];
for (const width of [390, 834, 1440]) {
  projects.push({
    name: `w${String(width)}`,
    use: { viewport: { height: 900, width } },
  });
}

export default { projects };
