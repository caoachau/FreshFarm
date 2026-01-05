export default function ReturnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Chính Sách Đổi Trả</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Điều Kiện Đổi Trả</h2>
          <p className="text-neutral-700 mb-4">
            Bạn có thể yêu cầu đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng với các điều kiện:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700">
            <li>Sản phẩm chưa sử dụng, còn nguyên tem, nhãn mác</li>
            <li>Sản phẩm bị lỗi do nhà sản xuất hoặc không đúng như mô tả</li>
            <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
            <li>Còn đầy đủ hóa đơn, phiếu giao hàng</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Quy Trình Đổi Trả</h2>
          <ol className="list-decimal pl-6 space-y-2 text-neutral-700">
            <li>Liên hệ hotline 1900 1234 hoặc email support@freshfarm.vn</li>
            <li>Cung cấp mã đơn hàng và lý do đổi trả</li>
            <li>Nhân viên sẽ xác nhận và hướng dẫn bạn gửi hàng về</li>
            <li>Sau khi nhận và kiểm tra, chúng tôi sẽ xử lý đổi trả trong 3-5 ngày</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Hoàn Tiền</h2>
          <p className="text-neutral-700 mb-4">
            Tiền hoàn lại sẽ được chuyển vào tài khoản của bạn trong vòng 5-7 ngày làm việc sau khi chúng tôi nhận và xác nhận sản phẩm đổi trả.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Sản Phẩm Không Được Đổi Trả</h2>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700">
            <li>Sản phẩm đã qua sử dụng</li>
            <li>Sản phẩm hết hạn sử dụng</li>
            <li>Sản phẩm không còn nguyên vẹn, thiếu phụ kiện</li>
            <li>Quá 7 ngày kể từ ngày nhận hàng</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Liên Hệ</h2>
          <p className="text-neutral-700">
            Mọi thắc mắc về đổi trả, vui lòng liên hệ:
            <br />
            Email: support@freshfarm.vn
            <br />
            Hotline: 1900 1234
          </p>
        </section>
      </div>
    </div>
  )
}

