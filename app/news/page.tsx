export default function NewsPage() {
  const articles = [
    {
      id: 1,
      title: "Những Lợi Ích Tuyệt Vời Của Rau Xanh Trong Chế Độ Ăn Hàng Ngày",
      excerpt: "Rau xanh không chỉ cung cấp vitamin và chất xơ, mà còn giúp tăng cường miễn dịch...",
      image: "raulydo.jpg?height=200&width=300",
      date: "20 Tháng 11, 2024",
      category: "Sức Khỏe",
    },
    {
      id: 2,
      title: "Cách Chọn Trái Cây Tươi Ngon Tại Chợ Hay Online",
      excerpt: "Hướng dẫn chi tiết cách lựa chọn những trái cây tươi, chất lượng cao...",
      image: "chontraicay.jpg?height=200&width=300",
      date: "18 Tháng 11, 2024",
      category: "Mẹo Nấu Ăn",
    },
    {
      id: 3,
      title: "Nông Sản Hữu Cơ - Sự Lựa Chọn Thông Minh Cho Gia Đình",
      excerpt: "Tìm hiểu về nông sản hữu cơ, lợi ích và cách phân biệt sản phẩm chính hãng...",
      image: "/nsoga.jpg?height=200&width=300",
      date: "15 Tháng 11, 2024",
      category: "Kiến Thức",
    },
    {
      id: 4,
      title: "Công Thức Nước Ép Trái Cây Tươi Mát Cho Mùa Hè",
      excerpt: "Những công thức đơn giản giúp bạn làm nước ép tại nhà, vừa ngon vừa bổ...",
      image: "/ncep.jpg?height=200&width=300",
      date: "12 Tháng 11, 2024",
      category: "Công Thức",
    },
    {
      id: 5,
      title: "Bảo Quản Nông Sản Tươi Lâu Hơn - Những Bí Quyết Hữu Dụng",
      excerpt: "Các mẹo bảo quản rau quả tươi lâu hơn, giữ được dinh dưỡng tối đa...",
      image: "baoquan.jpg?height=200&width=300",
      date: "10 Tháng 11, 2024",
      category: "Mẹo Bảo Quản",
    },
    {
      id: 6,
      title: "Dinh Dưỡng Trong Nông Sản - Bạn Biết Bao Nhiêu?",
      excerpt: "Khám phá giá trị dinh dưỡng của những loại rau quả phổ biến...",
      image: "tpdd.jpg?height=200&width=300",
      date: "08 Tháng 11, 2024",
      category: "Sức Khỏe",
    },
    {
      id: 7,
      title: "10 Lợi Ích Sức Khỏe Của Rau Lá Xanh",
      excerpt:
        "Rau lá xanh giàu vitamin và khoáng chất, hỗ trợ tiêu hóa, tim mạch, miễn dịch, tốt cho mắt, xương, da và giúp giảm nguy cơ bệnh mạn tính.",
      image: "10rau.jpg?height=200&width=300",
      date: "20 Tháng 11, 2024",
      category: "Sức Khỏe",
    },
    {
      id: 8,
      title: "Cách Chọn Và Bảo Quản Rau Quả Sạch",
      excerpt:
        "Hướng dẫn cách chọn rau quả sạch, an toàn cho sức khỏe và mẹo bảo quản đúng cách giúp rau quả tươi lâu, giữ trọn dinh dưỡng.",
      image: "cachchon.jpg?height=200&width=300",
      date: "22 Tháng 11, 2024",
      category: "Sức Khỏe",
    },
    {
      id: 9,
      title: "Công Thức Làm Bánh Quy Mật Ong Hàn Quốc",
      excerpt:
        "Hướng dẫn cách làm bánh quy mật ong Hàn Quốc thơm ngon, giòn nhẹ, dễ thực hiện tại nhà với nguyên liệu đơn giản.",
      image: "banhmatong.jpg?height=200&width=300",
      date: "25 Tháng 11, 2024",
      category: "Ẩm Thực",
    }
  
    
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Tin Tức & Bài Viết</h1>
      <p className="text-neutral-600 mb-12">Cập nhật những kiến thức hữu ích về nông sản, sức khỏe và mẹo nấu ăn</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {articles.slice(0, 2).map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
          >
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-neutral-500">{article.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 hover:text-primary">{article.title}</h3>
              <p className="text-neutral-600 text-sm">{article.excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(2).map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
          >
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-neutral-500">{article.date}</span>
              </div>
              <h3 className="font-bold text-sm mb-2 hover:text-primary line-clamp-2">{article.title}</h3>
              <p className="text-neutral-600 text-xs line-clamp-2">{article.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
