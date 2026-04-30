module.exports = async (params) => {
  const dv = app.plugins.plugins.dataview.api;

  const pages = dv.pages('"98 - Potential Lessons"')
    .where(p => p.status === "incomplete");

  const choices = pages.map(p => p.file.name);

  const selected = await params.quickAddApi.suggester(choices, choices);

  if (!selected) return;

  const file = app.vault.getAbstractFileByPath(`98 - Potential Lessons/${selected}.md`);

  // Move file
  await app.fileManager.renameFile(
    file,
    `01 - Active Lessons/${selected}.md`
  );

  // Update status
  const content = await app.vault.read(file);
  const updated = content.replace("status: incomplete", "status: in-progress");

  await app.vault.modify(file, updated);

  new Notice(`Moved: ${selected}`);
};