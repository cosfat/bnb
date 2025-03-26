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
exports.id = "app/api/reservations/[id]/route";
exports.ids = ["app/api/reservations/[id]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/reservations/[id]/route.js":
/*!********************************************!*\
  !*** ./app/api/reservations/[id]/route.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/prisma */ \"(rsc)/./app/lib/prisma.js\");\n/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/helpers */ \"(rsc)/./app/lib/helpers.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\n\n// Admin kontrolü için yardımcı fonksiyon\nasync function checkIsAdmin() {\n    try {\n        const headersList = (0,next_headers__WEBPACK_IMPORTED_MODULE_3__.headers)();\n        const userId = headersList.get('x-user-id');\n        if (!userId) {\n            return false;\n        }\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].worker.findUnique({\n            where: {\n                id: BigInt(userId)\n            }\n        });\n        return user?.isAdmin || false;\n    } catch (error) {\n        console.error(\"Admin check error:\", error);\n        return false;\n    }\n}\n// Belirli bir rezervasyonu getir\nasync function GET(request, { params }) {\n    try {\n        const paramsId = await params.id;\n        const id = BigInt(paramsId);\n        const reservation = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].reservation.findUnique({\n            where: {\n                id\n            }\n        });\n        if (!reservation) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Rezervasyon bulunamadı\"\n            }, {\n                status: 404\n            });\n        }\n        // İlgili bilgileri ayrı olarak al\n        let house = null;\n        let worker = null;\n        try {\n            if (reservation.house_id) {\n                house = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].house.findUnique({\n                    where: {\n                        id: reservation.house_id\n                    }\n                });\n            }\n            if (reservation.worker_id) {\n                worker = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].worker.findUnique({\n                    where: {\n                        id: reservation.worker_id\n                    }\n                });\n            }\n        } catch (error) {\n            console.error(\"Error fetching related data:\", error);\n        }\n        const completeReservation = {\n            ...reservation,\n            house: house || {\n                name: \"Bilinmiyor\",\n                id: 0\n            },\n            worker: worker || {\n                name: \"Bilinmiyor\",\n                id: 0\n            }\n        };\n        // BigInt değerlerini normal sayılara dönüştür\n        const serializedReservation = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_2__.convertBigIntToNumber)(completeReservation);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(serializedReservation);\n    } catch (error) {\n        console.error(\"GET reservation error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n// Rezervasyonu güncelle\nasync function PUT(request, { params }) {\n    try {\n        // Admin kontrolü\n        const isAdmin = await checkIsAdmin();\n        if (!isAdmin) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Bu işlem için admin yetkisi gereklidir\"\n            }, {\n                status: 403\n            });\n        }\n        const paramsId = await params.id;\n        const id = BigInt(paramsId);\n        const data = await request.json();\n        const updatedReservation = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].reservation.update({\n            where: {\n                id\n            },\n            data: {\n                name: data.name,\n                house_id: BigInt(data.house_id),\n                worker_id: BigInt(data.worker_id),\n                start: new Date(data.start),\n                finish: new Date(data.finish),\n                price: parseFloat(data.price),\n                info: data.info || null\n            }\n        });\n        // İlgili bilgileri ayrı olarak al\n        let house = null;\n        let worker = null;\n        try {\n            if (updatedReservation.house_id) {\n                house = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].house.findUnique({\n                    where: {\n                        id: updatedReservation.house_id\n                    }\n                });\n            }\n            if (updatedReservation.worker_id) {\n                worker = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].worker.findUnique({\n                    where: {\n                        id: updatedReservation.worker_id\n                    }\n                });\n            }\n        } catch (error) {\n            console.error(\"Error fetching related data:\", error);\n        }\n        const completeReservation = {\n            ...updatedReservation,\n            house: house || {\n                name: \"Bilinmiyor\",\n                id: 0\n            },\n            worker: worker || {\n                name: \"Bilinmiyor\",\n                id: 0\n            }\n        };\n        // BigInt değerlerini normal sayılara dönüştür\n        const serializedReservation = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_2__.convertBigIntToNumber)(completeReservation);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(serializedReservation);\n    } catch (error) {\n        console.error(\"PUT reservation error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n// Rezervasyonu sil\nasync function DELETE(request, { params }) {\n    try {\n        // Admin kontrolü\n        const isAdmin = await checkIsAdmin();\n        if (!isAdmin) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Bu işlem için admin yetkisi gereklidir\"\n            }, {\n                status: 403\n            });\n        }\n        const paramsId = await params.id;\n        const id = BigInt(paramsId);\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].reservation.delete({\n            where: {\n                id\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true\n        });\n    } catch (error) {\n        console.error(\"DELETE reservation error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Jlc2VydmF0aW9ucy9baWRdL3JvdXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkM7QUFDRjtBQUNvQjtBQUN0QjtBQUV2Qyx5Q0FBeUM7QUFDekMsZUFBZUk7SUFDYixJQUFJO1FBQ0YsTUFBTUMsY0FBY0YscURBQU9BO1FBQzNCLE1BQU1HLFNBQVNELFlBQVlFLEdBQUcsQ0FBQztRQUUvQixJQUFJLENBQUNELFFBQVE7WUFDWCxPQUFPO1FBQ1Q7UUFFQSxNQUFNRSxPQUFPLE1BQU1QLG1EQUFNQSxDQUFDUSxNQUFNLENBQUNDLFVBQVUsQ0FBQztZQUMxQ0MsT0FBTztnQkFBRUMsSUFBSUMsT0FBT1A7WUFBUTtRQUM5QjtRQUVBLE9BQU9FLE1BQU1NLFdBQVc7SUFDMUIsRUFBRSxPQUFPQyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyxzQkFBc0JBO1FBQ3BDLE9BQU87SUFDVDtBQUNGO0FBRUEsaUNBQWlDO0FBQzFCLGVBQWVFLElBQUlDLE9BQU8sRUFBRSxFQUFFQyxNQUFNLEVBQUU7SUFDM0MsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUQsT0FBT1AsRUFBRTtRQUNoQyxNQUFNQSxLQUFLQyxPQUFPTztRQUVsQixNQUFNQyxjQUFjLE1BQU1wQixtREFBTUEsQ0FBQ29CLFdBQVcsQ0FBQ1gsVUFBVSxDQUFDO1lBQ3REQyxPQUFPO2dCQUFFQztZQUFHO1FBQ2Q7UUFFQSxJQUFJLENBQUNTLGFBQWE7WUFDaEIsT0FBT3JCLHFEQUFZQSxDQUFDc0IsSUFBSSxDQUFDO2dCQUFFUCxPQUFPO1lBQXlCLEdBQUc7Z0JBQUVRLFFBQVE7WUFBSTtRQUM5RTtRQUVBLGtDQUFrQztRQUNsQyxJQUFJQyxRQUFRO1FBQ1osSUFBSWYsU0FBUztRQUViLElBQUk7WUFDRixJQUFJWSxZQUFZSSxRQUFRLEVBQUU7Z0JBQ3hCRCxRQUFRLE1BQU12QixtREFBTUEsQ0FBQ3VCLEtBQUssQ0FBQ2QsVUFBVSxDQUFDO29CQUNwQ0MsT0FBTzt3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QixtRUFBcUJBLENBQUN5QjtRQUVwRCxPQUFPM0IscURBQVlBLENBQUNzQixJQUFJLENBQUNPO0lBQzNCLEVBQUUsT0FBT2QsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsMEJBQTBCQTtRQUN4QyxPQUFPZixxREFBWUEsQ0FBQ3NCLElBQUksQ0FBQztZQUFFUCxPQUFPQSxNQUFNZSxPQUFPO1FBQUMsR0FBRztZQUFFUCxRQUFRO1FBQUk7SUFDbkU7QUFDRjtBQUVBLG1CQUFtQjtBQUNaLGVBQWVrQixPQUFPdkIsT0FBTyxFQUFFLEVBQUVDLE1BQU0sRUFBRTtJQUM5QyxJQUFJO1FBQ0YsaUJBQWlCO1FBQ2pCLE1BQU1MLFVBQVUsTUFBTVY7UUFDdEIsSUFBSSxDQUFDVSxTQUFTO1lBQ1osT0FBT2QscURBQVlBLENBQUNzQixJQUFJLENBQUM7Z0JBQUVQLE9BQU87WUFBeUMsR0FBRztnQkFBRVEsUUFBUTtZQUFJO1FBQzlGO1FBRUEsTUFBTUgsV0FBVyxNQUFNRCxPQUFPUCxFQUFFO1FBQ2hDLE1BQU1BLEtBQUtDLE9BQU9PO1FBRWxCLE1BQU1uQixtREFBTUEsQ0FBQ29CLFdBQVcsQ0FBQ3FCLE1BQU0sQ0FBQztZQUM5Qi9CLE9BQU87Z0JBQUVDO1lBQUc7UUFDZDtRQUVBLE9BQU9aLHFEQUFZQSxDQUFDc0IsSUFBSSxDQUFDO1lBQUVxQixTQUFTO1FBQUs7SUFDM0MsRUFBRSxPQUFPNUIsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsNkJBQTZCQTtRQUMzQyxPQUFPZixxREFBWUEsQ0FBQ3NCLElBQUksQ0FBQztZQUFFUCxPQUFPQSxNQUFNZSxPQUFPO1FBQUMsR0FBRztZQUFFUCxRQUFRO1FBQUk7SUFDbkU7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2Nvc2ZhdC9Eb2N1bWVudHMvV2ViIFByb2plY3RzL2JuYi9hcHAvYXBpL3Jlc2VydmF0aW9ucy9baWRdL3JvdXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHByaXNtYSBmcm9tIFwiLi4vLi4vLi4vbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgY29udmVydEJpZ0ludFRvTnVtYmVyIH0gZnJvbSBcIi4uLy4uLy4uL2xpYi9oZWxwZXJzXCI7XG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuXG4vLyBBZG1pbiBrb250cm9sw7wgacOnaW4geWFyZMSxbWPEsSBmb25rc2l5b25cbmFzeW5jIGZ1bmN0aW9uIGNoZWNrSXNBZG1pbigpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBoZWFkZXJzTGlzdCA9IGhlYWRlcnMoKTtcbiAgICBjb25zdCB1c2VySWQgPSBoZWFkZXJzTGlzdC5nZXQoJ3gtdXNlci1pZCcpO1xuICAgIFxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS53b3JrZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZDogQmlnSW50KHVzZXJJZCkgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHVzZXI/LmlzQWRtaW4gfHwgZmFsc2U7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkFkbWluIGNoZWNrIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIEJlbGlybGkgYmlyIHJlemVydmFzeW9udSBnZXRpclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0LCB7IHBhcmFtcyB9KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyYW1zSWQgPSBhd2FpdCBwYXJhbXMuaWQ7XG4gICAgY29uc3QgaWQgPSBCaWdJbnQocGFyYW1zSWQpO1xuICAgIFxuICAgIGNvbnN0IHJlc2VydmF0aW9uID0gYXdhaXQgcHJpc21hLnJlc2VydmF0aW9uLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgaWQgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNlcnZhdGlvbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiUmV6ZXJ2YXN5b24gYnVsdW5hbWFkxLFcIiB9LCB7IHN0YXR1czogNDA0IH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyDEsGxnaWxpIGJpbGdpbGVyaSBheXLEsSBvbGFyYWsgYWxcbiAgICBsZXQgaG91c2UgPSBudWxsO1xuICAgIGxldCB3b3JrZXIgPSBudWxsO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBpZiAocmVzZXJ2YXRpb24uaG91c2VfaWQpIHtcbiAgICAgICAgaG91c2UgPSBhd2FpdCBwcmlzbWEuaG91c2UuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IHJlc2VydmF0aW9uLmhvdXNlX2lkIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChyZXNlcnZhdGlvbi53b3JrZXJfaWQpIHtcbiAgICAgICAgd29ya2VyID0gYXdhaXQgcHJpc21hLndvcmtlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZTogeyBpZDogcmVzZXJ2YXRpb24ud29ya2VyX2lkIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyByZWxhdGVkIGRhdGE6XCIsIGVycm9yKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgY29tcGxldGVSZXNlcnZhdGlvbiA9IHtcbiAgICAgIC4uLnJlc2VydmF0aW9uLFxuICAgICAgaG91c2U6IGhvdXNlIHx8IHsgbmFtZTogXCJCaWxpbm1peW9yXCIsIGlkOiAwIH0sXG4gICAgICB3b3JrZXI6IHdvcmtlciB8fCB7IG5hbWU6IFwiQmlsaW5taXlvclwiLCBpZDogMCB9XG4gICAgfTtcblxuICAgIC8vIEJpZ0ludCBkZcSfZXJsZXJpbmkgbm9ybWFsIHNhecSxbGFyYSBkw7Zuw7zFn3TDvHJcbiAgICBjb25zdCBzZXJpYWxpemVkUmVzZXJ2YXRpb24gPSBjb252ZXJ0QmlnSW50VG9OdW1iZXIoY29tcGxldGVSZXNlcnZhdGlvbik7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc2VyaWFsaXplZFJlc2VydmF0aW9uKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiR0VUIHJlc2VydmF0aW9uIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG4vLyBSZXplcnZhc3lvbnUgZ8O8bmNlbGxlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUFVUKHJlcXVlc3QsIHsgcGFyYW1zIH0pIHtcbiAgdHJ5IHtcbiAgICAvLyBBZG1pbiBrb250cm9sw7xcbiAgICBjb25zdCBpc0FkbWluID0gYXdhaXQgY2hlY2tJc0FkbWluKCk7XG4gICAgaWYgKCFpc0FkbWluKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJCdSBpxZ9sZW0gacOnaW4gYWRtaW4geWV0a2lzaSBnZXJla2xpZGlyXCIgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbXNJZCA9IGF3YWl0IHBhcmFtcy5pZDtcbiAgICBjb25zdCBpZCA9IEJpZ0ludChwYXJhbXNJZCk7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gICAgY29uc3QgdXBkYXRlZFJlc2VydmF0aW9uID0gYXdhaXQgcHJpc21hLnJlc2VydmF0aW9uLnVwZGF0ZSh7XG4gICAgICB3aGVyZTogeyBpZCB9LFxuICAgICAgZGF0YToge1xuICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgIGhvdXNlX2lkOiBCaWdJbnQoZGF0YS5ob3VzZV9pZCksXG4gICAgICAgIHdvcmtlcl9pZDogQmlnSW50KGRhdGEud29ya2VyX2lkKSxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKGRhdGEuc3RhcnQpLFxuICAgICAgICBmaW5pc2g6IG5ldyBEYXRlKGRhdGEuZmluaXNoKSxcbiAgICAgICAgcHJpY2U6IHBhcnNlRmxvYXQoZGF0YS5wcmljZSksXG4gICAgICAgIGluZm86IGRhdGEuaW5mbyB8fCBudWxsXG4gICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgLy8gxLBsZ2lsaSBiaWxnaWxlcmkgYXlyxLEgb2xhcmFrIGFsXG4gICAgbGV0IGhvdXNlID0gbnVsbDtcbiAgICBsZXQgd29ya2VyID0gbnVsbDtcbiAgICBcbiAgICB0cnkge1xuICAgICAgaWYgKHVwZGF0ZWRSZXNlcnZhdGlvbi5ob3VzZV9pZCkge1xuICAgICAgICBob3VzZSA9IGF3YWl0IHByaXNtYS5ob3VzZS5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZTogeyBpZDogdXBkYXRlZFJlc2VydmF0aW9uLmhvdXNlX2lkIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICh1cGRhdGVkUmVzZXJ2YXRpb24ud29ya2VyX2lkKSB7XG4gICAgICAgIHdvcmtlciA9IGF3YWl0IHByaXNtYS53b3JrZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IHVwZGF0ZWRSZXNlcnZhdGlvbi53b3JrZXJfaWQgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHJlbGF0ZWQgZGF0YTpcIiwgZXJyb3IpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBjb21wbGV0ZVJlc2VydmF0aW9uID0ge1xuICAgICAgLi4udXBkYXRlZFJlc2VydmF0aW9uLFxuICAgICAgaG91c2U6IGhvdXNlIHx8IHsgbmFtZTogXCJCaWxpbm1peW9yXCIsIGlkOiAwIH0sXG4gICAgICB3b3JrZXI6IHdvcmtlciB8fCB7IG5hbWU6IFwiQmlsaW5taXlvclwiLCBpZDogMCB9XG4gICAgfTtcblxuICAgIC8vIEJpZ0ludCBkZcSfZXJsZXJpbmkgbm9ybWFsIHNhecSxbGFyYSBkw7Zuw7zFn3TDvHJcbiAgICBjb25zdCBzZXJpYWxpemVkUmVzZXJ2YXRpb24gPSBjb252ZXJ0QmlnSW50VG9OdW1iZXIoY29tcGxldGVSZXNlcnZhdGlvbik7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc2VyaWFsaXplZFJlc2VydmF0aW9uKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiUFVUIHJlc2VydmF0aW9uIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG4vLyBSZXplcnZhc3lvbnUgc2lsXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKHJlcXVlc3QsIHsgcGFyYW1zIH0pIHtcbiAgdHJ5IHtcbiAgICAvLyBBZG1pbiBrb250cm9sw7xcbiAgICBjb25zdCBpc0FkbWluID0gYXdhaXQgY2hlY2tJc0FkbWluKCk7XG4gICAgaWYgKCFpc0FkbWluKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJCdSBpxZ9sZW0gacOnaW4gYWRtaW4geWV0a2lzaSBnZXJla2xpZGlyXCIgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbXNJZCA9IGF3YWl0IHBhcmFtcy5pZDtcbiAgICBjb25zdCBpZCA9IEJpZ0ludChwYXJhbXNJZCk7XG5cbiAgICBhd2FpdCBwcmlzbWEucmVzZXJ2YXRpb24uZGVsZXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJERUxFVEUgcmVzZXJ2YXRpb24gZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJjb252ZXJ0QmlnSW50VG9OdW1iZXIiLCJoZWFkZXJzIiwiY2hlY2tJc0FkbWluIiwiaGVhZGVyc0xpc3QiLCJ1c2VySWQiLCJnZXQiLCJ1c2VyIiwid29ya2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaWQiLCJCaWdJbnQiLCJpc0FkbWluIiwiZXJyb3IiLCJjb25zb2xlIiwiR0VUIiwicmVxdWVzdCIsInBhcmFtcyIsInBhcmFtc0lkIiwicmVzZXJ2YXRpb24iLCJqc29uIiwic3RhdHVzIiwiaG91c2UiLCJob3VzZV9pZCIsIndvcmtlcl9pZCIsImNvbXBsZXRlUmVzZXJ2YXRpb24iLCJuYW1lIiwic2VyaWFsaXplZFJlc2VydmF0aW9uIiwibWVzc2FnZSIsIlBVVCIsImRhdGEiLCJ1cGRhdGVkUmVzZXJ2YXRpb24iLCJ1cGRhdGUiLCJzdGFydCIsIkRhdGUiLCJmaW5pc2giLCJwcmljZSIsInBhcnNlRmxvYXQiLCJpbmZvIiwiREVMRVRFIiwiZGVsZXRlIiwic3VjY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/reservations/[id]/route.js\n");

/***/ }),

/***/ "(rsc)/./app/lib/helpers.js":
/*!****************************!*\
  !*** ./app/lib/helpers.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   convertBigIntToNumber: () => (/* binding */ convertBigIntToNumber)\n/* harmony export */ });\n/**\n * BigInt değerlerini normal sayılara dönüştüren yardımcı fonksiyon\n * Prisma'dan dönen BigInt ID'leri normal sayılara dönüştürmek için kullanılır\n */ function convertBigIntToNumber(data) {\n    return JSON.parse(JSON.stringify(data, (key, value)=>{\n        if (typeof value === \"bigint\") {\n            return Number(value);\n        }\n        return value;\n    }));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL2hlbHBlcnMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Q0FHQyxHQUNNLFNBQVNBLHNCQUFzQkMsSUFBSTtJQUN4QyxPQUFPQyxLQUFLQyxLQUFLLENBQ2ZELEtBQUtFLFNBQVMsQ0FBQ0gsTUFBTSxDQUFDSSxLQUFLQztRQUN6QixJQUFJLE9BQU9BLFVBQVUsVUFBVTtZQUM3QixPQUFPQyxPQUFPRDtRQUNoQjtRQUNBLE9BQU9BO0lBQ1Q7QUFFSiIsInNvdXJjZXMiOlsiL1VzZXJzL2Nvc2ZhdC9Eb2N1bWVudHMvV2ViIFByb2plY3RzL2JuYi9hcHAvbGliL2hlbHBlcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCaWdJbnQgZGXEn2VybGVyaW5pIG5vcm1hbCBzYXnEsWxhcmEgZMO2bsO8xZ90w7xyZW4geWFyZMSxbWPEsSBmb25rc2l5b25cbiAqIFByaXNtYSdkYW4gZMO2bmVuIEJpZ0ludCBJRCdsZXJpIG5vcm1hbCBzYXnEsWxhcmEgZMO2bsO8xZ90w7xybWVrIGnDp2luIGt1bGxhbsSxbMSxclxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydEJpZ0ludFRvTnVtYmVyKGRhdGEpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoXG4gICAgSlNPTi5zdHJpbmdpZnkoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYmlnaW50XCIpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSlcbiAgKTtcbn0gIl0sIm5hbWVzIjpbImNvbnZlcnRCaWdJbnRUb051bWJlciIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJrZXkiLCJ2YWx1ZSIsIk51bWJlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/helpers.js\n");

/***/ }),

/***/ "(rsc)/./app/lib/prisma.js":
/*!***************************!*\
  !*** ./app/lib/prisma.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prisma istemcisinin global olarak tanımlanması\nconst globalForPrisma = global;\n// Development ortamında her sıcak yeniden yükleme sırasında birden fazla Prisma istemcisi oluşmasını önlemek için\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL3ByaXNtYS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsaURBQWlEO0FBQ2pELE1BQU1DLGtCQUFrQkM7QUFFeEIsa0hBQWtIO0FBQ2xILE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQTtBQUV6RCxJQUFJSSxJQUFzQyxFQUFFO0lBQzFDSCxnQkFBZ0JFLE1BQU0sR0FBR0E7QUFDM0I7QUFFQSxpRUFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsiL1VzZXJzL2Nvc2ZhdC9Eb2N1bWVudHMvV2ViIFByb2plY3RzL2JuYi9hcHAvbGliL3ByaXNtYS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XG5cbi8vIFByaXNtYSBpc3RlbWNpc2luaW4gZ2xvYmFsIG9sYXJhayB0YW7EsW1sYW5tYXPEsVxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsO1xuXG4vLyBEZXZlbG9wbWVudCBvcnRhbcSxbmRhIGhlciBzxLFjYWsgeWVuaWRlbiB5w7xrbGVtZSBzxLFyYXPEsW5kYSBiaXJkZW4gZmF6bGEgUHJpc21hIGlzdGVtY2lzaSBvbHXFn21hc8SxbsSxIMO2bmxlbWVrIGnDp2luXG5jb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTsgIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbCIsInByaXNtYSIsInByb2Nlc3MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/prisma.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2F%5Bid%5D%2Froute&page=%2Fapi%2Freservations%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2F%5Bid%5D%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2F%5Bid%5D%2Froute&page=%2Fapi%2Freservations%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2F%5Bid%5D%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_cosfat_Documents_Web_Projects_bnb_app_api_reservations_id_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/reservations/[id]/route.js */ \"(rsc)/./app/api/reservations/[id]/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reservations/[id]/route\",\n        pathname: \"/api/reservations/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/reservations/[id]/route\"\n    },\n    resolvedPagePath: \"/Users/cosfat/Documents/Web Projects/bnb/app/api/reservations/[id]/route.js\",\n    nextConfigOutput,\n    userland: _Users_cosfat_Documents_Web_Projects_bnb_app_api_reservations_id_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZyZXNlcnZhdGlvbnMlMkYlNUJpZCU1RCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcmVzZXJ2YXRpb25zJTJGJTVCaWQlNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZyZXNlcnZhdGlvbnMlMkYlNUJpZCU1RCUyRnJvdXRlLmpzJmFwcERpcj0lMkZVc2VycyUyRmNvc2ZhdCUyRkRvY3VtZW50cyUyRldlYiUyMFByb2plY3RzJTJGYm5iJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmNvc2ZhdCUyRkRvY3VtZW50cyUyRldlYiUyMFByb2plY3RzJTJGYm5iJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDMkI7QUFDeEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9jb3NmYXQvRG9jdW1lbnRzL1dlYiBQcm9qZWN0cy9ibmIvYXBwL2FwaS9yZXNlcnZhdGlvbnMvW2lkXS9yb3V0ZS5qc1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJzdGFuZGFsb25lXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3Jlc2VydmF0aW9ucy9baWRdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcmVzZXJ2YXRpb25zL1tpZF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Jlc2VydmF0aW9ucy9baWRdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2Nvc2ZhdC9Eb2N1bWVudHMvV2ViIFByb2plY3RzL2JuYi9hcHAvYXBpL3Jlc2VydmF0aW9ucy9baWRdL3JvdXRlLmpzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2F%5Bid%5D%2Froute&page=%2Fapi%2Freservations%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2F%5Bid%5D%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2F%5Bid%5D%2Froute&page=%2Fapi%2Freservations%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2F%5Bid%5D%2Froute.js&appDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fcosfat%2FDocuments%2FWeb%20Projects%2Fbnb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();