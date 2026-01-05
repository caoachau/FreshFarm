export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Về FreshFarm</h1>

        <div className="space-y-6 text-neutral-700 leading-relaxed">
          <p>
            FreshFarm là nền tảng thương mại điện tử chuyên cung cấp nông sản tươi sạch trực tuyến. Chúng tôi cam kết
            mang đến cho khách hàng những sản phẩm chất lượng cao nhất với giá cả hợp lý.
          </p>

          <div className="bg-primary/5 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cam Kết Của Chúng Tôi</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Giao hàng nhanh trong 2 giờ tại 62 tỉnh thành</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Miễn phí giao hàng cho đơn hàng trên 300.000₫</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>100% hàng chính hãng, được kiểm dịch an toàn</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Hoàn tiền 30 ngày nếu không hài lòng</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Giá độc quyền cho hội viên VIP</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Sứ Mệnh</h3>
              <p>
                Cung cấp nông sản tươi sạch, an toàn cho mọi gia đình Việt Nam, kết nối người sản xuất với người tiêu
                dùng một cách công bằng và minh bạch.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Tầm Nhìn</h3>
              <p>
                Trở thành nền tảng thương mại điện tử hàng đầu Việt Nam trong lĩnh vực nông sản, mang thay đổi tích cực
                cho cuộc sống hàng ngày của mọi người.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
