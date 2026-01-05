"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetcher = void 0;

// Generic fetcher dùng cho SWR, tự động gắn header x-user-id nếu có authToken
var fetcher = function fetcher(url) {
  var isBrowser, token, res, error;
  return regeneratorRuntime.async(function fetcher$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          isBrowser = typeof window !== "undefined";
          token = isBrowser ? window.localStorage.getItem("authToken") : null;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url, {
            headers: token ? {
              "x-user-id": token
            } : undefined
          }));

        case 4:
          res = _context.sent;

          if (res.ok) {
            _context.next = 12;
            break;
          }

          error = new Error("An error occurred while fetching the data."); // Gắn thông tin bổ sung vào đối tượng lỗi.

          _context.next = 9;
          return regeneratorRuntime.awrap(res.json()["catch"](function () {
            return {};
          }));

        case 9:
          error.info = _context.sent;
          error.status = res.status;
          throw error;

        case 12:
          return _context.abrupt("return", res.json());

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.fetcher = fetcher;