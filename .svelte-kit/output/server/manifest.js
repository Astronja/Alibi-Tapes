export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.B3QHRwEm.js",app:"_app/immutable/entry/app.rM4eMNAD.js",imports:["_app/immutable/entry/start.B3QHRwEm.js","_app/immutable/chunks/BQoohIxE.js","_app/immutable/chunks/DZDmEZMk.js","_app/immutable/chunks/C28Tfpeu.js","_app/immutable/entry/app.rM4eMNAD.js","_app/immutable/chunks/DZDmEZMk.js","_app/immutable/chunks/BcgnSMxp.js","_app/immutable/chunks/DXLwiZ0H.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
