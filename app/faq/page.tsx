export default function FAQPage() {
  const faqs = [
    {
      question: "Làm thế nào để đặt hàng?",
      answer: "Bạn có thể đặt hàng bằng cách thêm sản phẩm vào giỏ hàng, sau đó điền thông tin giao hàng và thanh toán. Xem chi tiết tại trang 'Hướng Dẫn Mua Hàng'."
    },
    {
      question: "Tôi có thể đổi trả sản phẩm không?",
      answer: "Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn. Xem chi tiết tại 'Chính Sách Đổi Trả'."
    },
    {
      question: "Phí giao hàng là bao nhiêu?",
      answer: "Miễn phí giao hàng cho đơn hàng từ 300.000₫. Đơn hàng dưới 300.000₫ sẽ tính phí 30.000₫."
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer: "Giao hàng nhanh trong 2 giờ cho khu vực nội thành. Giao hàng tiêu chuẩn 1-2 ngày cho các tỉnh thành khác."
    },
    {
      question: "Tôi có thể thanh toán bằng cách nào?",
      answer: "Chúng tôi hỗ trợ thanh toán khi nhận hàng (COD), VietQR, và chuyển khoản ngân hàng."
    },
    {
      question: "Làm sao để theo dõi đơn hàng?",
      answer: "Bạn có thể sử dụng tính năng 'Tra Cứu Đơn' trên website bằng mã đơn hàng hoặc số điện thoại. Hoặc đăng nhập vào tài khoản để xem lịch sử đơn hàng."
    },
    {
      question: "Sản phẩm có đảm bảo chất lượng không?",
      answer: "Tất cả sản phẩm của chúng tôi đều được kiểm tra chất lượng trước khi giao hàng. Chúng tôi cam kết cung cấp nông sản tươi sạch, an toàn."
    },
    {
      question: "Tôi có thể mua số lượng lớn không?",
      answer: "Có, bạn có thể liên hệ trực tiếp với chúng tôi qua hotline hoặc email để được tư vấn về đơn hàng số lượng lớn và giá ưu đãi."
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Câu Hỏi Thường Gặp</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-lg font-bold text-primary mb-2">
              {index + 1}. {faq.question}
            </h3>
            <p className="text-neutral-700">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-neutral-700 mb-2">
          Vẫn còn thắc mắc? Liên hệ với chúng tôi:
        </p>
        <p className="font-bold text-lg text-primary">Hotline: 1900 1234</p>
        <p className="text-neutral-600">Email: support@freshfarm.vn</p>
      </div>
    </div>
  )
}

