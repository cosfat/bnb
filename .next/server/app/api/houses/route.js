/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/houses/route";
exports.ids = ["app/api/houses/route"];
exports.modules = {

/***/ "(rsc)/./app/api/houses/route.js":
/*!*********************************!*\
  !*** ./app/api/houses/route.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/prisma */ \"(rsc)/./app/lib/prisma.js\");\n\n\n// BigInt değerlerini normal sayılara dönüştüren yardımcı fonksiyon\nfunction convertBigIntToNumber(data) {\n    return JSON.parse(JSON.stringify(data, (key, value)=>{\n        if (typeof value === \"bigint\") {\n            return Number(value);\n        }\n        return value;\n    }));\n}\n// Tüm evleri getir\nasync function GET() {\n    try {\n        console.log(\"Houses API called\");\n        try {\n            // Veritabanı bağlantısını test et\n            await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].$connect();\n            console.log(\"Prisma connection successful\");\n        } catch (connError) {\n            console.error(\"Prisma connection error:\", connError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Database connection error: \" + connError.message\n            }, {\n                status: 500\n            });\n        }\n        try {\n            const houses = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].house.findMany({\n                orderBy: {\n                    name: \"asc\"\n                }\n            });\n            console.log(\"Houses fetched:\", houses);\n            // BigInt değerlerini normal sayılara dönüştür\n            const serializedHouses = convertBigIntToNumber(houses);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(serializedHouses);\n        } catch (queryError) {\n            console.error(\"Query error:\", queryError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Query error: \" + queryError.message\n            }, {\n                status: 500\n            });\n        }\n    } catch (error) {\n        console.error(\"General error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n// Yeni ev ekle\nasync function POST(request) {\n    try {\n        const data = await request.json();\n        const house = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].house.create({\n            data: {\n                name: data.name\n            }\n        });\n        // BigInt değerlerini normal sayılara dönüştür\n        const serializedHouse = convertBigIntToNumber(house);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(serializedHouse, {\n            status: 201\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2hvdXNlcy9yb3V0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ0w7QUFFdEMsbUVBQW1FO0FBQ25FLFNBQVNFLHNCQUFzQkMsSUFBSTtJQUNqQyxPQUFPQyxLQUFLQyxLQUFLLENBQ2ZELEtBQUtFLFNBQVMsQ0FBQ0gsTUFBTSxDQUFDSSxLQUFLQztRQUN6QixJQUFJLE9BQU9BLFVBQVUsVUFBVTtZQUM3QixPQUFPQyxPQUFPRDtRQUNoQjtRQUNBLE9BQU9BO0lBQ1Q7QUFFSjtBQUVBLG1CQUFtQjtBQUNaLGVBQWVFO0lBQ3BCLElBQUk7UUFDRkMsUUFBUUMsR0FBRyxDQUFDO1FBRVosSUFBSTtZQUNGLGtDQUFrQztZQUNsQyxNQUFNWCxtREFBTUEsQ0FBQ1ksUUFBUTtZQUNyQkYsUUFBUUMsR0FBRyxDQUFDO1FBQ2QsRUFBRSxPQUFPRSxXQUFXO1lBQ2xCSCxRQUFRSSxLQUFLLENBQUMsNEJBQTRCRDtZQUMxQyxPQUFPZCxxREFBWUEsQ0FBQ2dCLElBQUksQ0FBQztnQkFBRUQsT0FBTyxnQ0FBZ0NELFVBQVVHLE9BQU87WUFBQyxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDdkc7UUFFQSxJQUFJO1lBQ0YsTUFBTUMsU0FBUyxNQUFNbEIsbURBQU1BLENBQUNtQixLQUFLLENBQUNDLFFBQVEsQ0FBQztnQkFDekNDLFNBQVM7b0JBQ1BDLE1BQU07Z0JBQ1I7WUFDRjtZQUNBWixRQUFRQyxHQUFHLENBQUMsbUJBQW1CTztZQUUvQiw4Q0FBOEM7WUFDOUMsTUFBTUssbUJBQW1CdEIsc0JBQXNCaUI7WUFFL0MsT0FBT25CLHFEQUFZQSxDQUFDZ0IsSUFBSSxDQUFDUTtRQUMzQixFQUFFLE9BQU9DLFlBQVk7WUFDbkJkLFFBQVFJLEtBQUssQ0FBQyxnQkFBZ0JVO1lBQzlCLE9BQU96QixxREFBWUEsQ0FBQ2dCLElBQUksQ0FBQztnQkFBRUQsT0FBTyxrQkFBa0JVLFdBQVdSLE9BQU87WUFBQyxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDMUY7SUFDRixFQUFFLE9BQU9ILE9BQU87UUFDZEosUUFBUUksS0FBSyxDQUFDLGtCQUFrQkE7UUFDaEMsT0FBT2YscURBQVlBLENBQUNnQixJQUFJLENBQUM7WUFBRUQsT0FBT0EsTUFBTUUsT0FBTztRQUFDLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ25FO0FBQ0Y7QUFFQSxlQUFlO0FBQ1IsZUFBZVEsS0FBS0MsT0FBTztJQUNoQyxJQUFJO1FBQ0YsTUFBTXhCLE9BQU8sTUFBTXdCLFFBQVFYLElBQUk7UUFFL0IsTUFBTUksUUFBUSxNQUFNbkIsbURBQU1BLENBQUNtQixLQUFLLENBQUNRLE1BQU0sQ0FBQztZQUN0Q3pCLE1BQU07Z0JBQ0pvQixNQUFNcEIsS0FBS29CLElBQUk7WUFDakI7UUFDRjtRQUVBLDhDQUE4QztRQUM5QyxNQUFNTSxrQkFBa0IzQixzQkFBc0JrQjtRQUU5QyxPQUFPcEIscURBQVlBLENBQUNnQixJQUFJLENBQUNhLGlCQUFpQjtZQUFFWCxRQUFRO1FBQUk7SUFDMUQsRUFBRSxPQUFPSCxPQUFPO1FBQ2QsT0FBT2YscURBQVlBLENBQUNnQixJQUFJLENBQUM7WUFBRUQsT0FBT0EsTUFBTUUsT0FBTztRQUFDLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ25FO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9jb3NmYXQvRG9jdW1lbnRzL1dlYiBQcm9qZWN0cy9ibmIvYXBwL2FwaS9ob3VzZXMvcm91dGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgcHJpc21hIGZyb20gXCIuLi8uLi9saWIvcHJpc21hXCI7XG5cbi8vIEJpZ0ludCBkZcSfZXJsZXJpbmkgbm9ybWFsIHNhecSxbGFyYSBkw7Zuw7zFn3TDvHJlbiB5YXJkxLFtY8SxIGZvbmtzaXlvblxuZnVuY3Rpb24gY29udmVydEJpZ0ludFRvTnVtYmVyKGRhdGEpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoXG4gICAgSlNPTi5zdHJpbmdpZnkoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYmlnaW50XCIpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSlcbiAgKTtcbn1cblxuLy8gVMO8bSBldmxlcmkgZ2V0aXJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coXCJIb3VzZXMgQVBJIGNhbGxlZFwiKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gVmVyaXRhYmFuxLEgYmHEn2xhbnTEsXPEsW7EsSB0ZXN0IGV0XG4gICAgICBhd2FpdCBwcmlzbWEuJGNvbm5lY3QoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiUHJpc21hIGNvbm5lY3Rpb24gc3VjY2Vzc2Z1bFwiKTtcbiAgICB9IGNhdGNoIChjb25uRXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcmlzbWEgY29ubmVjdGlvbiBlcnJvcjpcIiwgY29ubkVycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZXJyb3I6IFwiICsgY29ubkVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgICB9XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhvdXNlcyA9IGF3YWl0IHByaXNtYS5ob3VzZS5maW5kTWFueSh7XG4gICAgICAgIG9yZGVyQnk6IHtcbiAgICAgICAgICBuYW1lOiBcImFzY1wiLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhcIkhvdXNlcyBmZXRjaGVkOlwiLCBob3VzZXMpO1xuICAgICAgXG4gICAgICAvLyBCaWdJbnQgZGXEn2VybGVyaW5pIG5vcm1hbCBzYXnEsWxhcmEgZMO2bsO8xZ90w7xyXG4gICAgICBjb25zdCBzZXJpYWxpemVkSG91c2VzID0gY29udmVydEJpZ0ludFRvTnVtYmVyKGhvdXNlcyk7XG4gICAgICBcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihzZXJpYWxpemVkSG91c2VzKTtcbiAgICB9IGNhdGNoIChxdWVyeUVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiUXVlcnkgZXJyb3I6XCIsIHF1ZXJ5RXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiUXVlcnkgZXJyb3I6IFwiICsgcXVlcnlFcnJvci5tZXNzYWdlIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJHZW5lcmFsIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG4vLyBZZW5pIGV2IGVrbGVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgXG4gICAgY29uc3QgaG91c2UgPSBhd2FpdCBwcmlzbWEuaG91c2UuY3JlYXRlKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEJpZ0ludCBkZcSfZXJsZXJpbmkgbm9ybWFsIHNhecSxbGFyYSBkw7Zuw7zFn3TDvHJcbiAgICBjb25zdCBzZXJpYWxpemVkSG91c2UgPSBjb252ZXJ0QmlnSW50VG9OdW1iZXIoaG91c2UpO1xuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihzZXJpYWxpemVkSG91c2UsIHsgc3RhdHVzOiAyMDEgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwiY29udmVydEJpZ0ludFRvTnVtYmVyIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsInZhbHVlIiwiTnVtYmVyIiwiR0VUIiwiY29uc29sZSIsImxvZyIsIiRjb25uZWN0IiwiY29ubkVycm9yIiwiZXJyb3IiLCJqc29uIiwibWVzc2FnZSIsInN0YXR1cyIsImhvdXNlcyIsImhvdXNlIiwiZmluZE1hbnkiLCJvcmRlckJ5IiwibmFtZSIsInNlcmlhbGl6ZWRIb3VzZXMiLCJxdWVyeUVycm9yIiwiUE9TVCIsInJlcXVlc3QiLCJjcmVhdGUiLCJzZXJpYWxpemVkSG91c2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/houses/route.js\n");

/***/ }),

/***/ "(rsc)/./app/lib/prisma.js":
/*!***************************!*\
  !*** ./app/lib/prisma.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prisma istemcisinin global olarak tanımlanması\nconst globalForPrisma = global;\n// Development ortamında her sıcak yeniden yükleme sırasında birden fazla Prisma istemcisi oluşmasını önlemek için\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL3ByaXNtYS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsaURBQWlEO0FBQ2pELE1BQU1DLGtCQUFrQkM7QUFFeEIsa0hBQWtIO0FBQ2xILE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQTtBQUV6RCxJQUFJSSxJQUFzQyxFQUFFO0lBQzFDSCxnQkFBZ0JFLE1BQU0sR0FBR0E7QUFDM0I7QUFFQSxpRUFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsiL1VzZXJzL2Nvc2ZhdC9Eb2N1bWVudHMvV2ViIFByb2plY3RzL2JuYi9hcHAvbGliL3ByaXNtYS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XG5cbi8vIFByaXNtYSBpc3RlbWNpc2luaW4gZ2xvYmFsIG9sYXJhayB0YW7EsW1sYW5tYXPEsVxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsO1xuXG4vLyBEZXZlbG9wbWVudCBvcnRhbcSxbmRhIGhlciBzxLFjYWsgeWVuaWRlbiB5w7xrbGVtZSBzxLFyYXPEsW5kYSBiaXJkZW4gZmF6bGEgUHJpc21hIGlzdGVtY2lzaSBvbHXFn21hc8SxbsSxIMO2bmxlbWVrIGnDp2luXG5jb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTsgIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbCIsInByaXNtYSIsInByb2Nlc3MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/prisma.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fhouses%2Froute&page=%2Fapi%2Fhouses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fhouses%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fhouses%2Froute&page=%2Fapi%2Fhouses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fhouses%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_cosfat_Documents_Web_Projects_bnb_app_api_houses_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/houses/route.js */ \"(rsc)/./app/api/houses/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/houses/route\",\n        pathname: \"/api/houses\",\n        filename: \"route\",\n        bundlePath: \"app/api/houses/route\"\n    },\n    resolvedPagePath: \"/Users/cosfat/Documents/Web Projects/bnb/app/api/houses/route.js\",\n    nextConfigOutput,\n    userland: _Users_cosfat_Documents_Web_Projects_bnb_app_api_houses_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZob3VzZXMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmhvdXNlcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmhvdXNlcyUyRnJvdXRlLmpzJmFwcERpcj0lMkZVc2VycyUyRmNvc2ZhdCUyRkRvY3VtZW50cyUyRldlYiUyMFByb2plY3RzJTJGYm5iJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmNvc2ZhdCUyRkRvY3VtZW50cyUyRldlYiUyMFByb2plY3RzJTJGYm5iJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDZ0I7QUFDN0Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9jb3NmYXQvRG9jdW1lbnRzL1dlYiBQcm9qZWN0cy9ibmIvYXBwL2FwaS9ob3VzZXMvcm91dGUuanNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwic3RhbmRhbG9uZVwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9ob3VzZXMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9ob3VzZXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2hvdXNlcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9jb3NmYXQvRG9jdW1lbnRzL1dlYiBQcm9qZWN0cy9ibmIvYXBwL2FwaS9ob3VzZXMvcm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fhouses%2Froute&page=%2Fapi%2Fhouses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fhouses%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fhouses%2Froute&page=%2Fapi%2Fhouses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fhouses%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();