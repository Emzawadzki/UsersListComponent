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
/******/ 	var hotCurrentHash = "538317e00dc32635f81e"; // eslint-disable-line no-unused-vars
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
eval("\n\n__webpack_require__(1);\n\n/**\r\n * ~~~ SETUP ~~~\r\n */\n// TODO: grid cols sizes from left to right - should include 4 natural numbers, of which sum equals 24\nvar gridSizes = [8, 6, 6, 4];\n\ndocument.addEventListener('DOMContentLoaded', function (e) {\n  /**\r\n   * Setting header chosen classes\r\n   */\n  for (var i = 0; i < gridSizes.length; i++) {\n    document.getElementById('js-user-list-title-' + i).classList.add('user-list--col-' + gridSizes[i]);\n  }\n\n  /**\r\n   * Initial injection from DB to DOM on load\r\n   */\n  var userList = document.getElementById('js-user-list');\n\n  data.forEach(function (el, i) {\n    // append single element\n    var userElement = document.createElement('li');\n    userElement.classList.add('user-list__user');\n    userList.appendChild(userElement);\n\n    // append element data\n    var deleteButtonId = 'js-delete-user-' + i;\n\n    userElement.innerHTML = '\\n      <ul class=\"user-list__row\">\\n        <li class=\"user-list__data user-list--col-' + gridSizes[0] + '\">\\n          ' + el.name + '\\n        </li>\\n        <li class=\"user-list__data user-list--col-' + gridSizes[1] + '\">\\n          ' + el.age + '\\n        </li>\\n        <li class=\"user-list__data user-list--col-' + gridSizes[2] + '\">\\n          ' + el.zodiac + '\\n        </li>\\n        <li class=\"user-list__data user-list--col-' + gridSizes[3] + '\">\\n          <button type=\"button\" class=\"user-list__button\" id=\"' + deleteButtonId + '\"><span class=\"user-list__message\">DELETE</span><i class=\"user-list__icon fas fa-trash\"></i></button>\\n        </li>\\n      </ul>\\n    ';\n\n    // add DELETE button listener\n    document.getElementById(deleteButtonId).addEventListener('click', function () {\n      deleteElement(userElement);\n    });\n    return false;\n  });\n\n  // DELETE button handler\n  function deleteElement(element) {\n    // remove previous popup\n    var prevPopup = document.getElementById('js-user-list-popup');\n    if (prevPopup) {\n      prevPopup.parentElement.classList.remove('user-list--active');\n      prevPopup.remove();\n    }\n\n    var confirmPopup = document.createElement('div');\n\n    // choose and set proper popup class (depending on window width)\n    confirmPopup.classList.add('user-list__popup');\n    setPopup(confirmPopup, element, userList);\n\n    // generate popup content\n    confirmPopup.id = 'js-user-list-popup';\n    confirmPopup.innerHTML = '\\n      <span class=\"user-list__confirm-msg\">Are you sure you want to remove this item?</span>\\n      <button type=\"button\" class=\"user-list__cancel-btn\" id=\"js-delete-user-cancel\">NO</button>\\n      <button type=\"button\" class=\"user-list__confirm-btn\" id=\"js-delete-user-confirm\">YES</button>\\n    ';\n    element.appendChild(confirmPopup);\n    element.classList.add('user-list--active');\n\n    // cancel delete event\n    document.getElementById('js-delete-user-cancel').addEventListener('click', function (e) {\n      element.classList.remove('user-list--active');\n      confirmPopup.remove();\n    });\n\n    // confirm delete event\n    document.getElementById('js-delete-user-confirm').addEventListener('click', function (e) {\n      element.remove();\n    });\n\n    return false;\n  };\n\n  /**\r\n   * Detecting scrollbar width\r\n   */\n\n  function getScrollbarWidth() {\n    var outer = document.createElement(\"div\");\n    outer.style.visibility = \"hidden\";\n    outer.style.width = \"100px\";\n    outer.style.msOverflowStyle = \"scrollbar\";\n\n    document.body.appendChild(outer);\n\n    var widthNoScroll = outer.offsetWidth;\n    // force scrollbars\n    outer.style.overflow = \"scroll\";\n\n    // add innerdiv\n    var inner = document.createElement(\"div\");\n    inner.style.width = \"100%\";\n    outer.appendChild(inner);\n\n    var widthWithScroll = inner.offsetWidth;\n\n    // remove divs\n    outer.parentNode.removeChild(outer);\n\n    return widthNoScroll - widthWithScroll;\n  }\n\n  // Set list margin accordingly to browser scrollbar\n\n  userList.style.marginRight = -getScrollbarWidth() + 'px';\n\n  // Set list margin with width change\n\n  window.addEventListener('resize', function () {\n    userList.style.marginRight = -getScrollbarWidth() + 'px';\n    return false;\n  });\n\n  /**\r\n   * Change popup direction function\r\n   */\n  function setPopup(popup, parentElement, scrolledElement) {\n    var popupBreakPoint = 240;\n    if (window.innerWidth <= 600) {\n      popupBreakPoint = 180;\n    }\n\n    if (parentElement.offsetTop - scrolledElement.scrollTop > popupBreakPoint && !popup.classList.contains('user-list--popup-upside-down')) {\n      popup.classList.add('user-list--popup-upside-down');\n    } else if (parentElement.offsetTop - scrolledElement.scrollTop <= popupBreakPoint && popup.classList.contains('user-list--popup-upside-down')) {\n      popup.classList.remove('user-list--popup-upside-down');\n    }\n\n    return false;\n  }\n\n  /**\r\n   * Change popup orientation on scroll (optional)\r\n   */\n\n  var popupElement = null;\n  var popupElementPar = null;\n\n  userList.addEventListener('scroll', function () {\n    popupElement = document.getElementById('js-user-list-popup');\n\n    if (popupElement) {\n      popupElementPar = popupElement.parentElement;\n      setPopup(popupElement, popupElementPar, userList);\n    }\n\n    return false;\n  });\n});\n\n// example JSON-like DB TODO: to be replaced by actual DB\nvar data = [{\n  name: \"Lorem ipsum\",\n  age: 12,\n  zodiac: \"Gemini\"\n}, {\n  name: \"Dolor Sit\",\n  age: 24,\n  zodiac: \"Libra\"\n}, {\n  name: \"Amet Consectetur\",\n  age: 22,\n  zodiac: \"Aquarius\"\n}, {\n  name: \"Adipisicing Elit\",\n  age: 29,\n  zodiac: \"Cancer\"\n}, {\n  name: \"Earum Perferendis\",\n  age: 32,\n  zodiac: \"Scorpio\"\n}, {\n  name: \"Aspernatur Minima\",\n  age: 54,\n  zodiac: \"Pisces\"\n}, {\n  name: \"Sapiente Veritatis\",\n  age: 19,\n  zodiac: \"Aries\"\n}, {\n  name: \"Enim Reprehenderit\",\n  age: 35,\n  zodiac: \"Sagittarius\"\n}, {\n  name: \"Earum Perferendis\",\n  age: 65,\n  zodiac: \"Scorpio\"\n}, {\n  name: \"Aspernatur Minima\",\n  age: 86,\n  zodiac: \"Pisces\"\n}, {\n  name: \"Sapiente Veritatis\",\n  age: 15,\n  zodiac: \"Aries\"\n}, {\n  name: \"Enim Reprehenderit\",\n  age: 66,\n  zodiac: \"Sagittarius\"\n}];//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2pzL3VzZXItbGlzdC5qcz8xNGRjIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vc2Nzcy9tYWluLnNjc3MnKTtcblxuLyoqXHJcbiAqIH5+fiBTRVRVUCB+fn5cclxuICovXG4vLyBUT0RPOiBncmlkIGNvbHMgc2l6ZXMgZnJvbSBsZWZ0IHRvIHJpZ2h0IC0gc2hvdWxkIGluY2x1ZGUgNCBuYXR1cmFsIG51bWJlcnMsIG9mIHdoaWNoIHN1bSBlcXVhbHMgMjRcbnZhciBncmlkU2l6ZXMgPSBbOCwgNiwgNiwgNF07XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xuICAvKipcclxuICAgKiBTZXR0aW5nIGhlYWRlciBjaG9zZW4gY2xhc3Nlc1xyXG4gICAqL1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGdyaWRTaXplcy5sZW5ndGg7IGkrKykge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy11c2VyLWxpc3QtdGl0bGUtJyArIGkpLmNsYXNzTGlzdC5hZGQoJ3VzZXItbGlzdC0tY29sLScgKyBncmlkU2l6ZXNbaV0pO1xuICB9XG5cbiAgLyoqXHJcbiAgICogSW5pdGlhbCBpbmplY3Rpb24gZnJvbSBEQiB0byBET00gb24gbG9hZFxyXG4gICAqL1xuICB2YXIgdXNlckxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtdXNlci1saXN0Jyk7XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgIC8vIGFwcGVuZCBzaW5nbGUgZWxlbWVudFxuICAgIHZhciB1c2VyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgdXNlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndXNlci1saXN0X191c2VyJyk7XG4gICAgdXNlckxpc3QuYXBwZW5kQ2hpbGQodXNlckVsZW1lbnQpO1xuXG4gICAgLy8gYXBwZW5kIGVsZW1lbnQgZGF0YVxuICAgIHZhciBkZWxldGVCdXR0b25JZCA9ICdqcy1kZWxldGUtdXNlci0nICsgaTtcblxuICAgIHVzZXJFbGVtZW50LmlubmVySFRNTCA9ICdcXG4gICAgICA8dWwgY2xhc3M9XCJ1c2VyLWxpc3RfX3Jvd1wiPlxcbiAgICAgICAgPGxpIGNsYXNzPVwidXNlci1saXN0X19kYXRhIHVzZXItbGlzdC0tY29sLScgKyBncmlkU2l6ZXNbMF0gKyAnXCI+XFxuICAgICAgICAgICcgKyBlbC5uYW1lICsgJ1xcbiAgICAgICAgPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cInVzZXItbGlzdF9fZGF0YSB1c2VyLWxpc3QtLWNvbC0nICsgZ3JpZFNpemVzWzFdICsgJ1wiPlxcbiAgICAgICAgICAnICsgZWwuYWdlICsgJ1xcbiAgICAgICAgPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cInVzZXItbGlzdF9fZGF0YSB1c2VyLWxpc3QtLWNvbC0nICsgZ3JpZFNpemVzWzJdICsgJ1wiPlxcbiAgICAgICAgICAnICsgZWwuem9kaWFjICsgJ1xcbiAgICAgICAgPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cInVzZXItbGlzdF9fZGF0YSB1c2VyLWxpc3QtLWNvbC0nICsgZ3JpZFNpemVzWzNdICsgJ1wiPlxcbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInVzZXItbGlzdF9fYnV0dG9uXCIgaWQ9XCInICsgZGVsZXRlQnV0dG9uSWQgKyAnXCI+PHNwYW4gY2xhc3M9XCJ1c2VyLWxpc3RfX21lc3NhZ2VcIj5ERUxFVEU8L3NwYW4+PGkgY2xhc3M9XCJ1c2VyLWxpc3RfX2ljb24gZmFzIGZhLXRyYXNoXCI+PC9pPjwvYnV0dG9uPlxcbiAgICAgICAgPC9saT5cXG4gICAgICA8L3VsPlxcbiAgICAnO1xuXG4gICAgLy8gYWRkIERFTEVURSBidXR0b24gbGlzdGVuZXJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkZWxldGVCdXR0b25JZCkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkZWxldGVFbGVtZW50KHVzZXJFbGVtZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8vIERFTEVURSBidXR0b24gaGFuZGxlclxuICBmdW5jdGlvbiBkZWxldGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAvLyByZW1vdmUgcHJldmlvdXMgcG9wdXBcbiAgICB2YXIgcHJldlBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXVzZXItbGlzdC1wb3B1cCcpO1xuICAgIGlmIChwcmV2UG9wdXApIHtcbiAgICAgIHByZXZQb3B1cC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3VzZXItbGlzdC0tYWN0aXZlJyk7XG4gICAgICBwcmV2UG9wdXAucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpcm1Qb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgLy8gY2hvb3NlIGFuZCBzZXQgcHJvcGVyIHBvcHVwIGNsYXNzIChkZXBlbmRpbmcgb24gd2luZG93IHdpZHRoKVxuICAgIGNvbmZpcm1Qb3B1cC5jbGFzc0xpc3QuYWRkKCd1c2VyLWxpc3RfX3BvcHVwJyk7XG4gICAgc2V0UG9wdXAoY29uZmlybVBvcHVwLCBlbGVtZW50LCB1c2VyTGlzdCk7XG5cbiAgICAvLyBnZW5lcmF0ZSBwb3B1cCBjb250ZW50XG4gICAgY29uZmlybVBvcHVwLmlkID0gJ2pzLXVzZXItbGlzdC1wb3B1cCc7XG4gICAgY29uZmlybVBvcHVwLmlubmVySFRNTCA9ICdcXG4gICAgICA8c3BhbiBjbGFzcz1cInVzZXItbGlzdF9fY29uZmlybS1tc2dcIj5BcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgaXRlbT88L3NwYW4+XFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ1c2VyLWxpc3RfX2NhbmNlbC1idG5cIiBpZD1cImpzLWRlbGV0ZS11c2VyLWNhbmNlbFwiPk5PPC9idXR0b24+XFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ1c2VyLWxpc3RfX2NvbmZpcm0tYnRuXCIgaWQ9XCJqcy1kZWxldGUtdXNlci1jb25maXJtXCI+WUVTPC9idXR0b24+XFxuICAgICc7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjb25maXJtUG9wdXApO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndXNlci1saXN0LS1hY3RpdmUnKTtcblxuICAgIC8vIGNhbmNlbCBkZWxldGUgZXZlbnRcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtZGVsZXRlLXVzZXItY2FuY2VsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd1c2VyLWxpc3QtLWFjdGl2ZScpO1xuICAgICAgY29uZmlybVBvcHVwLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gY29uZmlybSBkZWxldGUgZXZlbnRcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtZGVsZXRlLXVzZXItY29uZmlybScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXHJcbiAgICogRGV0ZWN0aW5nIHNjcm9sbGJhciB3aWR0aFxyXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCkge1xuICAgIHZhciBvdXRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgb3V0ZXIuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgb3V0ZXIuc3R5bGUud2lkdGggPSBcIjEwMHB4XCI7XG4gICAgb3V0ZXIuc3R5bGUubXNPdmVyZmxvd1N0eWxlID0gXCJzY3JvbGxiYXJcIjtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3V0ZXIpO1xuXG4gICAgdmFyIHdpZHRoTm9TY3JvbGwgPSBvdXRlci5vZmZzZXRXaWR0aDtcbiAgICAvLyBmb3JjZSBzY3JvbGxiYXJzXG4gICAgb3V0ZXIuc3R5bGUub3ZlcmZsb3cgPSBcInNjcm9sbFwiO1xuXG4gICAgLy8gYWRkIGlubmVyZGl2XG4gICAgdmFyIGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBpbm5lci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgIG91dGVyLmFwcGVuZENoaWxkKGlubmVyKTtcblxuICAgIHZhciB3aWR0aFdpdGhTY3JvbGwgPSBpbm5lci5vZmZzZXRXaWR0aDtcblxuICAgIC8vIHJlbW92ZSBkaXZzXG4gICAgb3V0ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvdXRlcik7XG5cbiAgICByZXR1cm4gd2lkdGhOb1Njcm9sbCAtIHdpZHRoV2l0aFNjcm9sbDtcbiAgfVxuXG4gIC8vIFNldCBsaXN0IG1hcmdpbiBhY2NvcmRpbmdseSB0byBicm93c2VyIHNjcm9sbGJhclxuXG4gIHVzZXJMaXN0LnN0eWxlLm1hcmdpblJpZ2h0ID0gLWdldFNjcm9sbGJhcldpZHRoKCkgKyAncHgnO1xuXG4gIC8vIFNldCBsaXN0IG1hcmdpbiB3aXRoIHdpZHRoIGNoYW5nZVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdXNlckxpc3Quc3R5bGUubWFyZ2luUmlnaHQgPSAtZ2V0U2Nyb2xsYmFyV2lkdGgoKSArICdweCc7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAvKipcclxuICAgKiBDaGFuZ2UgcG9wdXAgZGlyZWN0aW9uIGZ1bmN0aW9uXHJcbiAgICovXG4gIGZ1bmN0aW9uIHNldFBvcHVwKHBvcHVwLCBwYXJlbnRFbGVtZW50LCBzY3JvbGxlZEVsZW1lbnQpIHtcbiAgICB2YXIgcG9wdXBCcmVha1BvaW50ID0gMjQwO1xuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSA2MDApIHtcbiAgICAgIHBvcHVwQnJlYWtQb2ludCA9IDE4MDtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50RWxlbWVudC5vZmZzZXRUb3AgLSBzY3JvbGxlZEVsZW1lbnQuc2Nyb2xsVG9wID4gcG9wdXBCcmVha1BvaW50ICYmICFwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3VzZXItbGlzdC0tcG9wdXAtdXBzaWRlLWRvd24nKSkge1xuICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgndXNlci1saXN0LS1wb3B1cC11cHNpZGUtZG93bicpO1xuICAgIH0gZWxzZSBpZiAocGFyZW50RWxlbWVudC5vZmZzZXRUb3AgLSBzY3JvbGxlZEVsZW1lbnQuc2Nyb2xsVG9wIDw9IHBvcHVwQnJlYWtQb2ludCAmJiBwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3VzZXItbGlzdC0tcG9wdXAtdXBzaWRlLWRvd24nKSkge1xuICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgndXNlci1saXN0LS1wb3B1cC11cHNpZGUtZG93bicpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxyXG4gICAqIENoYW5nZSBwb3B1cCBvcmllbnRhdGlvbiBvbiBzY3JvbGwgKG9wdGlvbmFsKVxyXG4gICAqL1xuXG4gIHZhciBwb3B1cEVsZW1lbnQgPSBudWxsO1xuICB2YXIgcG9wdXBFbGVtZW50UGFyID0gbnVsbDtcblxuICB1c2VyTGlzdC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgcG9wdXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLXVzZXItbGlzdC1wb3B1cCcpO1xuXG4gICAgaWYgKHBvcHVwRWxlbWVudCkge1xuICAgICAgcG9wdXBFbGVtZW50UGFyID0gcG9wdXBFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBzZXRQb3B1cChwb3B1cEVsZW1lbnQsIHBvcHVwRWxlbWVudFBhciwgdXNlckxpc3QpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59KTtcblxuLy8gZXhhbXBsZSBKU09OLWxpa2UgREIgVE9ETzogdG8gYmUgcmVwbGFjZWQgYnkgYWN0dWFsIERCXG52YXIgZGF0YSA9IFt7XG4gIG5hbWU6IFwiTG9yZW0gaXBzdW1cIixcbiAgYWdlOiAxMixcbiAgem9kaWFjOiBcIkdlbWluaVwiXG59LCB7XG4gIG5hbWU6IFwiRG9sb3IgU2l0XCIsXG4gIGFnZTogMjQsXG4gIHpvZGlhYzogXCJMaWJyYVwiXG59LCB7XG4gIG5hbWU6IFwiQW1ldCBDb25zZWN0ZXR1clwiLFxuICBhZ2U6IDIyLFxuICB6b2RpYWM6IFwiQXF1YXJpdXNcIlxufSwge1xuICBuYW1lOiBcIkFkaXBpc2ljaW5nIEVsaXRcIixcbiAgYWdlOiAyOSxcbiAgem9kaWFjOiBcIkNhbmNlclwiXG59LCB7XG4gIG5hbWU6IFwiRWFydW0gUGVyZmVyZW5kaXNcIixcbiAgYWdlOiAzMixcbiAgem9kaWFjOiBcIlNjb3JwaW9cIlxufSwge1xuICBuYW1lOiBcIkFzcGVybmF0dXIgTWluaW1hXCIsXG4gIGFnZTogNTQsXG4gIHpvZGlhYzogXCJQaXNjZXNcIlxufSwge1xuICBuYW1lOiBcIlNhcGllbnRlIFZlcml0YXRpc1wiLFxuICBhZ2U6IDE5LFxuICB6b2RpYWM6IFwiQXJpZXNcIlxufSwge1xuICBuYW1lOiBcIkVuaW0gUmVwcmVoZW5kZXJpdFwiLFxuICBhZ2U6IDM1LFxuICB6b2RpYWM6IFwiU2FnaXR0YXJpdXNcIlxufSwge1xuICBuYW1lOiBcIkVhcnVtIFBlcmZlcmVuZGlzXCIsXG4gIGFnZTogNjUsXG4gIHpvZGlhYzogXCJTY29ycGlvXCJcbn0sIHtcbiAgbmFtZTogXCJBc3Blcm5hdHVyIE1pbmltYVwiLFxuICBhZ2U6IDg2LFxuICB6b2RpYWM6IFwiUGlzY2VzXCJcbn0sIHtcbiAgbmFtZTogXCJTYXBpZW50ZSBWZXJpdGF0aXNcIixcbiAgYWdlOiAxNSxcbiAgem9kaWFjOiBcIkFyaWVzXCJcbn0sIHtcbiAgbmFtZTogXCJFbmltIFJlcHJlaGVuZGVyaXRcIixcbiAgYWdlOiA2NixcbiAgem9kaWFjOiBcIlNhZ2l0dGFyaXVzXCJcbn1dO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvdXNlci1saXN0LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3Njc3MvbWFpbi5zY3NzPzY1ZTEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3Njc3MvbWFpbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);