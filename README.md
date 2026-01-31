Online Bookstore Website - Academic Capstone Project
Dự án xây dựng website bán sách trực tuyến đầy đủ tính năng (Full-stack), được phát triển như một đồ án chuyên ngành. Hệ thống hỗ trợ quản lý toàn diện từ sản phẩm, danh mục đến phân quyền người dùng và quy trình mua hàng.

🚀 Tính năng chính
Đối với Khách hàng (Customer)
Duyệt sản phẩm: Xem danh sách sách theo danh mục, tìm kiếm và xem chi tiết thông tin sách.

Giỏ hàng (Shopping Cart): Quản lý giỏ hàng dựa trên session, cho phép thêm/sửa/xóa sản phẩm trước khi thanh toán.

Wishlist: Lưu trữ danh sách các sản phẩm yêu thích cá nhân.

Tài khoản: Đăng ký, đăng nhập và quản lý thông tin cá nhân.

Đối với Quản trị viên (Admin)
Dashboard: Tổng quan hoạt động của hệ thống thông qua giao diện quản trị chuyên nghiệp.

Quản lý Sản phẩm (CRUD): Thêm mới sách, cập nhật thông tin, hình ảnh và xóa sản phẩm.

Quản lý Danh mục: Phân loại sách theo các chủ đề khác nhau để tối ưu hóa tìm kiếm.

Quản lý Liên hệ: Tiếp nhận và phản hồi các thông tin liên hệ từ khách hàng.

🛠 Công nghệ sử dụng
Backend: Node.js & ExpressJS framework.

Database: MongoDB với Mongoose ODM để quản lý lược đồ dữ liệu và quan hệ.

Authentication: Passport.js (Local Strategy) hỗ trợ đăng nhập đa vai trò.

View Engine: Handlebars (HBS) với các helpers tùy chỉnh để render giao diện động.

Frontend: Bootstrap 4, HTML5, CSS3, SCSS và jQuery cho giao diện đáp ứng (Responsive).

Công cụ khác: * bcryptjs: Mã hóa bảo mật mật khẩu người dùng.

connect-flash: Hiển thị thông báo phản hồi nhanh cho người dùng.

method-override: Hỗ trợ các phương thức HTTP như PUT hoặc DELETE.

📁 Cấu trúc thư mục tiêu biểu
/models: Định nghĩa cấu trúc dữ liệu cho Product, Category, Customer, Employee.

/routes: Quản lý các luồng điều hướng của Admin và Customer.

/views: Chứa các file template HBS cho giao diện người dùng và quản trị.

/public: Chứa các tài nguyên tĩnh như hình ảnh, CSS, JS của thư viện.

app.js: Tệp cấu hình chính của ứng dụng.

💻 Hướng dẫn cài đặt
Clone repository:

Bash
git clone https://github.com/NguyenDoan274/thucTapChuyenNganh.git
Cài đặt các thư viện cần thiết:

Bash
npm install
Cấu hình Cơ sở dữ liệu:

Đảm bảo bạn đã cài đặt và đang chạy MongoDB tại localhost:27017.

Cơ sở dữ liệu mặc định sẽ được tạo là QuanLyBanSach.

Chạy ứng dụng:

Bash
npm start
Truy cập:

Giao diện khách hàng: http://localhost:3000

Giao diện Admin: http://localhost:3000/admin

Phát triển bởi: Doan Le Hoang Nguyen