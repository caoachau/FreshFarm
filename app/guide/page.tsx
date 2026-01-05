export default function GuidePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hướng Dẫn Mua Hàng</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Bước 1: Tìm Kiếm Sản Phẩm</h2>
          <p className="text-neutral-700 mb-3">
            Bạn có thể tìm kiếm sản phẩm bằng cách:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Sử dụng thanh tìm kiếm ở header</li>
            <li>• Duyệt theo danh mục sản phẩm</li>
            <li>• Xem sản phẩm bán chạy, khuyến mãi trên trang chủ</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Bước 2: Thêm Vào Giỏ Hàng</h2>
          <p className="text-neutral-700 mb-3">
            Sau khi chọn sản phẩm:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Chọn số lượng sản phẩm</li>
            <li>• Click nút "Thêm vào giỏ hàng"</li>
            <li>• Kiểm tra giỏ hàng và điều chỉnh số lượng nếu cần</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Bước 3: Thanh Toán</h2>
          <p className="text-neutral-700 mb-3">
            Tại trang thanh toán:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Điền thông tin giao hàng (họ tên, SĐT, địa chỉ)</li>
            <li>• Chọn phương thức thanh toán (COD hoặc VietQR)</li>
            <li>• Xác nhận đơn hàng</li>
            <li>• Nhận email xác nhận đơn hàng</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Bước 4: Theo Dõi Đơn Hàng</h2>
          <p className="text-neutral-700 mb-3">
            Sau khi đặt hàng:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Sử dụng tính năng "Tra Cứu Đơn" để theo dõi trạng thái</li>
            <li>• Xem chi tiết đơn hàng trong tài khoản của bạn</li>
            <li>• Nhận thông báo khi đơn hàng được giao</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

