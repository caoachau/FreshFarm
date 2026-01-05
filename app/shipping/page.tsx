export default function ShippingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chính Sách Giao Hàng</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Phí Giao Hàng</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• Miễn phí giao hàng cho đơn hàng từ 300.000₫</li>
            <li>• Phí giao hàng 30.000₫ cho đơn hàng dưới 300.000₫</li>
            <li>• Giao hàng nhanh trong vòng 2 giờ (áp dụng cho khu vực nội thành)</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Thời Gian Giao Hàng</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• <strong>Giao hàng nhanh:</strong> 2 giờ (nội thành TP.HCM, Hà Nội)</li>
            <li>• <strong>Giao hàng tiêu chuẩn:</strong> 1-2 ngày (các tỉnh thành khác)</li>
            <li>• <strong>Giao hàng xa:</strong> 3-5 ngày (vùng sâu, vùng xa)</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Khu Vực Giao Hàng</h2>
          <p className="text-neutral-700 mb-2">Chúng tôi giao hàng toàn quốc:</p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Tất cả các tỉnh thành trong cả nước</li>
            <li>• Ưu tiên giao hàng nhanh cho các thành phố lớn</li>
            <li>• Hỗ trợ giao hàng tận nơi, tận tay khách hàng</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
