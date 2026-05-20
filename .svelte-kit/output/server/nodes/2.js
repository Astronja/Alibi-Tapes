

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.d6jLcNUW.js","_app/immutable/chunks/DZDmEZMk.js","_app/immutable/chunks/DXLwiZ0H.js","_app/immutable/chunks/C28Tfpeu.js"];
export const stylesheets = ["_app/immutable/assets/2.3snBSHik.css"];
export const fonts = [];
