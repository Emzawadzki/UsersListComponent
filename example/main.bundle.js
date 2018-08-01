/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "303021a5d39c40eb1b63"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(1);\n\n/**\r\n * ~~~ SETUP ~~~\r\n */\n// TODO: grid cols sizes from left to right - should include 4 natural numbers, of which sum equals 24\nvar gridSizes = [8, 6, 6, 4]; // TODO: remove if imported in your main script file\n\n\ndocument.addEventListener('DOMContentLoaded', function (e) {\n  /**\r\n   * Setting header chosen classes\r\n   */\n  for (var i = 0; i < gridSizes.length; i++) {\n    document.getElementById('js-user-list-title-' + i).classList.add('user-list--col-' + gridSizes[i]);\n  }\n\n  /**\r\n   * Initial injection from DB to DOM on load\r\n   */\n  var userList = document.getElementById('js-user-list');\n\n  data.forEach(function (el, i) {\n    // append single element\n    var userElement = document.createElement('li');\n    userElement.classList.add('user-list__user');\n    userList.appendChild(userElement);\n\n    // append element data\n    var deleteButtonId = 'js-delete-user-' + i;\n\n    userElement.innerHTML = '\\n      <ul class=\"user-list__row\">\\n        <li class=\"user-list__data user-list--col-' + gridSizes[0] + '\">\\n          ' + el.name + '\\n        </li>\\n        <li class=\"user-list__data user-list--col-' + gridSizes[1] + '\">\\n          ' + el.age + '\\n        </li>\\n        <li class=\"user-list__data user-list--col-' + gridSizes[2] + '\">\\n          ' + el.zodiac + '\\n        </li>\\n        <li class=\"user-list__data user-list--col-' + gridSizes[3] + '\">\\n          <button type=\"button\" class=\"user-list__button\" id=\"' + deleteButtonId + '\"><span class=\"user-list__message\">DELETE</span><i class=\"user-list__icon fas fa-trash\"></i></button>\\n        </li>\\n      </ul>\\n    ';\n\n    // add DELETE button listener\n    document.getElementById(deleteButtonId).addEventListener('click', function () {\n      deleteElement(userElement);\n    });\n    return false;\n  });\n\n  // DELETE button handler\n  function deleteElement(element) {\n    // remove previous popup\n    var prevPopup = document.getElementById('js-user-list-popup');\n    if (prevPopup) {\n      prevPopup.parentElement.classList.remove('user-list--active');\n      prevPopup.remove();\n    }\n\n    var confirmPopup = document.createElement('div');\n\n    // choose and set proper popup class (depending on window width)\n    confirmPopup.classList.add('user-list__popup');\n    setPopup(confirmPopup, element, userList);\n\n    // generate popup content\n    confirmPopup.id = 'js-user-list-popup';\n    confirmPopup.innerHTML = '\\n      <span class=\"user-list__confirm-msg\">Are you sure you want to remove this item?</span>\\n      <button type=\"button\" class=\"user-list__cancel-btn\" id=\"js-delete-user-cancel\">NO</button>\\n      <button type=\"button\" class=\"user-list__confirm-btn\" id=\"js-delete-user-confirm\">YES</button>\\n    ';\n    element.appendChild(confirmPopup);\n    element.classList.add('user-list--active');\n\n    // cancel delete event\n    document.getElementById('js-delete-user-cancel').addEventListener('click', function (e) {\n      element.classList.remove('user-list--active');\n      confirmPopup.remove();\n    });\n\n    // confirm delete event\n    document.getElementById('js-delete-user-confirm').addEventListener('click', function (e) {\n      element.remove();\n    });\n\n    return false;\n  };\n\n  /**\r\n   * Detecting scrollbar width\r\n   */\n\n  function getScrollbarWidth() {\n    var outer = document.createElement(\"div\");\n    outer.style.visibility = \"hidden\";\n    outer.style.width = \"100px\";\n    outer.style.msOverflowStyle = \"scrollbar\";\n\n    document.body.appendChild(outer);\n\n    var widthNoScroll = outer.offsetWidth;\n    // force scrollbars\n    outer.style.overflow = \"scroll\";\n\n    // add innerdiv\n    var inner = document.createElement(\"div\");\n    inner.style.width = \"100%\";\n    outer.appendChild(inner);\n\n    var widthWithScroll = inner.offsetWidth;\n\n    // remove divs\n    outer.parentNode.removeChild(outer);\n\n    return widthNoScroll - widthWithScroll;\n  }\n\n  // Set list margin accordingly to browser scrollbar\n\n  userList.style.marginRight = -getScrollbarWidth() + 'px';\n\n  // Set list margin with width change\n\n  window.addEventListener('resize', function () {\n    userList.style.marginRight = -getScrollbarWidth() + 'px';\n    return false;\n  });\n\n  /**\r\n   * Change popup direction function\r\n   */\n  function setPopup(popup, parentElement, scrolledElement) {\n    // get flexible breakpoint\n    var sideObjWidth = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content');\n    sideObjWidth = parseInt(sideObjWidth.slice(1, sideObjWidth.length - 1));\n    sideObjWidth = sideObjWidth ? sideObjWidth : 0;\n\n    var popupBreakPoint = 240;\n    if (window.innerWidth <= 600 + sideObjWidth) {\n      popupBreakPoint = 180;\n    }\n\n    if (parentElement.offsetTop - scrolledElement.scrollTop > popupBreakPoint && !popup.classList.contains('user-list--popup-upside-down')) {\n      popup.classList.add('user-list--popup-upside-down');\n    } else if (parentElement.offsetTop - scrolledElement.scrollTop <= popupBreakPoint && popup.classList.contains('user-list--popup-upside-down')) {\n      popup.classList.remove('user-list--popup-upside-down');\n    }\n\n    return false;\n  }\n\n  /**\r\n   * Change popup orientation on scroll or resize (optional)\r\n   */\n\n  var popupElement = null;\n  var popupElementPar = null;\n\n  function changePopupOrientation() {\n    popupElement = document.getElementById('js-user-list-popup');\n\n    if (popupElement) {\n      popupElementPar = popupElement.parentElement;\n      setPopup(popupElement, popupElementPar, userList);\n    }\n\n    return false;\n  }\n\n  userList.addEventListener('scroll', changePopupOrientation);\n  window.addEventListener('resize', changePopupOrientation);\n});\n\n// example JSON-like DB TODO: to be replaced by actual DB\nvar data = [{\n  name: \"Lorem ipsum\",\n  age: 12,\n  zodiac: \"Gemini\"\n}, {\n  name: \"Dolor Sit\",\n  age: 24,\n  zodiac: \"Libra\"\n}, {\n  name: \"Amet Consectetur\",\n  age: 22,\n  zodiac: \"Aquarius\"\n}, {\n  name: \"Adipisicing Elit\",\n  age: 29,\n  zodiac: \"Cancer\"\n}, {\n  name: \"Earum Perferendis\",\n  age: 32,\n  zodiac: \"Scorpio\"\n}, {\n  name: \"Aspernatur Minima\",\n  age: 54,\n  zodiac: \"Pisces\"\n}, {\n  name: \"Sapiente Veritatis\",\n  age: 19,\n  zodiac: \"Aries\"\n}, {\n  name: \"Enim Reprehenderit\",\n  age: 35,\n  zodiac: \"Sagittarius\"\n}, {\n  name: \"Earum Perferendis\",\n  age: 65,\n  zodiac: \"Scorpio\"\n}, {\n  name: \"Aspernatur Minima\",\n  age: 86,\n  zodiac: \"Pisces\"\n}, {\n  name: \"Sapiente Veritatis\",\n  age: 15,\n  zodiac: \"Aries\"\n}, {\n  name: \"Enim Reprehenderit\",\n  age: 66,\n  zodiac: \"Sagittarius\"\n}];//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2pzL3VzZXItbGlzdC5qcz8xNGRjIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vc2Nzcy9tYWluLnNjc3MnKTtcblxuLyoqXHJcbiAqIH5+fiBTRVRVUCB+fn5cclxuICovXG4vLyBUT0RPOiBncmlkIGNvbHMgc2l6ZXMgZnJvbSBsZWZ0IHRvIHJpZ2h0IC0gc2hvdWxkIGluY2x1ZGUgNCBuYXR1cmFsIG51bWJlcnMsIG9mIHdoaWNoIHN1bSBlcXVhbHMgMjRcbnZhciBncmlkU2l6ZXMgPSBbOCwgNiwgNiwgNF07IC8vIFRPRE86IHJlbW92ZSBpZiBpbXBvcnRlZCBpbiB5b3VyIG1haW4gc2NyaXB0IGZpbGVcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcbiAgLyoqXHJcbiAgICogU2V0dGluZyBoZWFkZXIgY2hvc2VuIGNsYXNzZXNcclxuICAgKi9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBncmlkU2l6ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtdXNlci1saXN0LXRpdGxlLScgKyBpKS5jbGFzc0xpc3QuYWRkKCd1c2VyLWxpc3QtLWNvbC0nICsgZ3JpZFNpemVzW2ldKTtcbiAgfVxuXG4gIC8qKlxyXG4gICAqIEluaXRpYWwgaW5qZWN0aW9uIGZyb20gREIgdG8gRE9NIG9uIGxvYWRcclxuICAgKi9cbiAgdmFyIHVzZXJMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXVzZXItbGlzdCcpO1xuXG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAvLyBhcHBlbmQgc2luZ2xlIGVsZW1lbnRcbiAgICB2YXIgdXNlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIHVzZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VzZXItbGlzdF9fdXNlcicpO1xuICAgIHVzZXJMaXN0LmFwcGVuZENoaWxkKHVzZXJFbGVtZW50KTtcblxuICAgIC8vIGFwcGVuZCBlbGVtZW50IGRhdGFcbiAgICB2YXIgZGVsZXRlQnV0dG9uSWQgPSAnanMtZGVsZXRlLXVzZXItJyArIGk7XG5cbiAgICB1c2VyRWxlbWVudC5pbm5lckhUTUwgPSAnXFxuICAgICAgPHVsIGNsYXNzPVwidXNlci1saXN0X19yb3dcIj5cXG4gICAgICAgIDxsaSBjbGFzcz1cInVzZXItbGlzdF9fZGF0YSB1c2VyLWxpc3QtLWNvbC0nICsgZ3JpZFNpemVzWzBdICsgJ1wiPlxcbiAgICAgICAgICAnICsgZWwubmFtZSArICdcXG4gICAgICAgIDwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XCJ1c2VyLWxpc3RfX2RhdGEgdXNlci1saXN0LS1jb2wtJyArIGdyaWRTaXplc1sxXSArICdcIj5cXG4gICAgICAgICAgJyArIGVsLmFnZSArICdcXG4gICAgICAgIDwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XCJ1c2VyLWxpc3RfX2RhdGEgdXNlci1saXN0LS1jb2wtJyArIGdyaWRTaXplc1syXSArICdcIj5cXG4gICAgICAgICAgJyArIGVsLnpvZGlhYyArICdcXG4gICAgICAgIDwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XCJ1c2VyLWxpc3RfX2RhdGEgdXNlci1saXN0LS1jb2wtJyArIGdyaWRTaXplc1szXSArICdcIj5cXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ1c2VyLWxpc3RfX2J1dHRvblwiIGlkPVwiJyArIGRlbGV0ZUJ1dHRvbklkICsgJ1wiPjxzcGFuIGNsYXNzPVwidXNlci1saXN0X19tZXNzYWdlXCI+REVMRVRFPC9zcGFuPjxpIGNsYXNzPVwidXNlci1saXN0X19pY29uIGZhcyBmYS10cmFzaFwiPjwvaT48L2J1dHRvbj5cXG4gICAgICAgIDwvbGk+XFxuICAgICAgPC91bD5cXG4gICAgJztcblxuICAgIC8vIGFkZCBERUxFVEUgYnV0dG9uIGxpc3RlbmVyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGVsZXRlQnV0dG9uSWQpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgZGVsZXRlRWxlbWVudCh1c2VyRWxlbWVudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAvLyBERUxFVEUgYnV0dG9uIGhhbmRsZXJcbiAgZnVuY3Rpb24gZGVsZXRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgLy8gcmVtb3ZlIHByZXZpb3VzIHBvcHVwXG4gICAgdmFyIHByZXZQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy11c2VyLWxpc3QtcG9wdXAnKTtcbiAgICBpZiAocHJldlBvcHVwKSB7XG4gICAgICBwcmV2UG9wdXAucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd1c2VyLWxpc3QtLWFjdGl2ZScpO1xuICAgICAgcHJldlBvcHVwLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHZhciBjb25maXJtUG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIC8vIGNob29zZSBhbmQgc2V0IHByb3BlciBwb3B1cCBjbGFzcyAoZGVwZW5kaW5nIG9uIHdpbmRvdyB3aWR0aClcbiAgICBjb25maXJtUG9wdXAuY2xhc3NMaXN0LmFkZCgndXNlci1saXN0X19wb3B1cCcpO1xuICAgIHNldFBvcHVwKGNvbmZpcm1Qb3B1cCwgZWxlbWVudCwgdXNlckxpc3QpO1xuXG4gICAgLy8gZ2VuZXJhdGUgcG9wdXAgY29udGVudFxuICAgIGNvbmZpcm1Qb3B1cC5pZCA9ICdqcy11c2VyLWxpc3QtcG9wdXAnO1xuICAgIGNvbmZpcm1Qb3B1cC5pbm5lckhUTUwgPSAnXFxuICAgICAgPHNwYW4gY2xhc3M9XCJ1c2VyLWxpc3RfX2NvbmZpcm0tbXNnXCI+QXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIGl0ZW0/PC9zcGFuPlxcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwidXNlci1saXN0X19jYW5jZWwtYnRuXCIgaWQ9XCJqcy1kZWxldGUtdXNlci1jYW5jZWxcIj5OTzwvYnV0dG9uPlxcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwidXNlci1saXN0X19jb25maXJtLWJ0blwiIGlkPVwianMtZGVsZXRlLXVzZXItY29uZmlybVwiPllFUzwvYnV0dG9uPlxcbiAgICAnO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY29uZmlybVBvcHVwKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VzZXItbGlzdC0tYWN0aXZlJyk7XG5cbiAgICAvLyBjYW5jZWwgZGVsZXRlIGV2ZW50XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWRlbGV0ZS11c2VyLWNhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgndXNlci1saXN0LS1hY3RpdmUnKTtcbiAgICAgIGNvbmZpcm1Qb3B1cC5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIC8vIGNvbmZpcm0gZGVsZXRlIGV2ZW50XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWRlbGV0ZS11c2VyLWNvbmZpcm0nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8qKlxyXG4gICAqIERldGVjdGluZyBzY3JvbGxiYXIgd2lkdGhcclxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRTY3JvbGxiYXJXaWR0aCgpIHtcbiAgICB2YXIgb3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG91dGVyLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIG91dGVyLnN0eWxlLndpZHRoID0gXCIxMDBweFwiO1xuICAgIG91dGVyLnN0eWxlLm1zT3ZlcmZsb3dTdHlsZSA9IFwic2Nyb2xsYmFyXCI7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG91dGVyKTtcblxuICAgIHZhciB3aWR0aE5vU2Nyb2xsID0gb3V0ZXIub2Zmc2V0V2lkdGg7XG4gICAgLy8gZm9yY2Ugc2Nyb2xsYmFyc1xuICAgIG91dGVyLnN0eWxlLm92ZXJmbG93ID0gXCJzY3JvbGxcIjtcblxuICAgIC8vIGFkZCBpbm5lcmRpdlxuICAgIHZhciBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgaW5uZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICBvdXRlci5hcHBlbmRDaGlsZChpbm5lcik7XG5cbiAgICB2YXIgd2lkdGhXaXRoU2Nyb2xsID0gaW5uZXIub2Zmc2V0V2lkdGg7XG5cbiAgICAvLyByZW1vdmUgZGl2c1xuICAgIG91dGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob3V0ZXIpO1xuXG4gICAgcmV0dXJuIHdpZHRoTm9TY3JvbGwgLSB3aWR0aFdpdGhTY3JvbGw7XG4gIH1cblxuICAvLyBTZXQgbGlzdCBtYXJnaW4gYWNjb3JkaW5nbHkgdG8gYnJvd3NlciBzY3JvbGxiYXJcblxuICB1c2VyTGlzdC5zdHlsZS5tYXJnaW5SaWdodCA9IC1nZXRTY3JvbGxiYXJXaWR0aCgpICsgJ3B4JztcblxuICAvLyBTZXQgbGlzdCBtYXJnaW4gd2l0aCB3aWR0aCBjaGFuZ2VcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgIHVzZXJMaXN0LnN0eWxlLm1hcmdpblJpZ2h0ID0gLWdldFNjcm9sbGJhcldpZHRoKCkgKyAncHgnO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgLyoqXHJcbiAgICogQ2hhbmdlIHBvcHVwIGRpcmVjdGlvbiBmdW5jdGlvblxyXG4gICAqL1xuICBmdW5jdGlvbiBzZXRQb3B1cChwb3B1cCwgcGFyZW50RWxlbWVudCwgc2Nyb2xsZWRFbGVtZW50KSB7XG4gICAgLy8gZ2V0IGZsZXhpYmxlIGJyZWFrcG9pbnRcbiAgICB2YXIgc2lkZU9ialdpZHRoID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2NvbnRlbnQnKTtcbiAgICBzaWRlT2JqV2lkdGggPSBwYXJzZUludChzaWRlT2JqV2lkdGguc2xpY2UoMSwgc2lkZU9ialdpZHRoLmxlbmd0aCAtIDEpKTtcbiAgICBzaWRlT2JqV2lkdGggPSBzaWRlT2JqV2lkdGggPyBzaWRlT2JqV2lkdGggOiAwO1xuXG4gICAgdmFyIHBvcHVwQnJlYWtQb2ludCA9IDI0MDtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gNjAwICsgc2lkZU9ialdpZHRoKSB7XG4gICAgICBwb3B1cEJyZWFrUG9pbnQgPSAxODA7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudEVsZW1lbnQub2Zmc2V0VG9wIC0gc2Nyb2xsZWRFbGVtZW50LnNjcm9sbFRvcCA+IHBvcHVwQnJlYWtQb2ludCAmJiAhcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd1c2VyLWxpc3QtLXBvcHVwLXVwc2lkZS1kb3duJykpIHtcbiAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3VzZXItbGlzdC0tcG9wdXAtdXBzaWRlLWRvd24nKTtcbiAgICB9IGVsc2UgaWYgKHBhcmVudEVsZW1lbnQub2Zmc2V0VG9wIC0gc2Nyb2xsZWRFbGVtZW50LnNjcm9sbFRvcCA8PSBwb3B1cEJyZWFrUG9pbnQgJiYgcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd1c2VyLWxpc3QtLXBvcHVwLXVwc2lkZS1kb3duJykpIHtcbiAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3VzZXItbGlzdC0tcG9wdXAtdXBzaWRlLWRvd24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcclxuICAgKiBDaGFuZ2UgcG9wdXAgb3JpZW50YXRpb24gb24gc2Nyb2xsIG9yIHJlc2l6ZSAob3B0aW9uYWwpXHJcbiAgICovXG5cbiAgdmFyIHBvcHVwRWxlbWVudCA9IG51bGw7XG4gIHZhciBwb3B1cEVsZW1lbnRQYXIgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZVBvcHVwT3JpZW50YXRpb24oKSB7XG4gICAgcG9wdXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXVzZXItbGlzdC1wb3B1cCcpO1xuXG4gICAgaWYgKHBvcHVwRWxlbWVudCkge1xuICAgICAgcG9wdXBFbGVtZW50UGFyID0gcG9wdXBFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBzZXRQb3B1cChwb3B1cEVsZW1lbnQsIHBvcHVwRWxlbWVudFBhciwgdXNlckxpc3QpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHVzZXJMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGNoYW5nZVBvcHVwT3JpZW50YXRpb24pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2hhbmdlUG9wdXBPcmllbnRhdGlvbik7XG59KTtcblxuLy8gZXhhbXBsZSBKU09OLWxpa2UgREIgVE9ETzogdG8gYmUgcmVwbGFjZWQgYnkgYWN0dWFsIERCXG52YXIgZGF0YSA9IFt7XG4gIG5hbWU6IFwiTG9yZW0gaXBzdW1cIixcbiAgYWdlOiAxMixcbiAgem9kaWFjOiBcIkdlbWluaVwiXG59LCB7XG4gIG5hbWU6IFwiRG9sb3IgU2l0XCIsXG4gIGFnZTogMjQsXG4gIHpvZGlhYzogXCJMaWJyYVwiXG59LCB7XG4gIG5hbWU6IFwiQW1ldCBDb25zZWN0ZXR1clwiLFxuICBhZ2U6IDIyLFxuICB6b2RpYWM6IFwiQXF1YXJpdXNcIlxufSwge1xuICBuYW1lOiBcIkFkaXBpc2ljaW5nIEVsaXRcIixcbiAgYWdlOiAyOSxcbiAgem9kaWFjOiBcIkNhbmNlclwiXG59LCB7XG4gIG5hbWU6IFwiRWFydW0gUGVyZmVyZW5kaXNcIixcbiAgYWdlOiAzMixcbiAgem9kaWFjOiBcIlNjb3JwaW9cIlxufSwge1xuICBuYW1lOiBcIkFzcGVybmF0dXIgTWluaW1hXCIsXG4gIGFnZTogNTQsXG4gIHpvZGlhYzogXCJQaXNjZXNcIlxufSwge1xuICBuYW1lOiBcIlNhcGllbnRlIFZlcml0YXRpc1wiLFxuICBhZ2U6IDE5LFxuICB6b2RpYWM6IFwiQXJpZXNcIlxufSwge1xuICBuYW1lOiBcIkVuaW0gUmVwcmVoZW5kZXJpdFwiLFxuICBhZ2U6IDM1LFxuICB6b2RpYWM6IFwiU2FnaXR0YXJpdXNcIlxufSwge1xuICBuYW1lOiBcIkVhcnVtIFBlcmZlcmVuZGlzXCIsXG4gIGFnZTogNjUsXG4gIHpvZGlhYzogXCJTY29ycGlvXCJcbn0sIHtcbiAgbmFtZTogXCJBc3Blcm5hdHVyIE1pbmltYVwiLFxuICBhZ2U6IDg2LFxuICB6b2RpYWM6IFwiUGlzY2VzXCJcbn0sIHtcbiAgbmFtZTogXCJTYXBpZW50ZSBWZXJpdGF0aXNcIixcbiAgYWdlOiAxNSxcbiAgem9kaWFjOiBcIkFyaWVzXCJcbn0sIHtcbiAgbmFtZTogXCJFbmltIFJlcHJlaGVuZGVyaXRcIixcbiAgYWdlOiA2NixcbiAgem9kaWFjOiBcIlNhZ2l0dGFyaXVzXCJcbn1dO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvdXNlci1saXN0LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3Njc3MvbWFpbi5zY3NzPzY1ZTEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3Njc3MvbWFpbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);