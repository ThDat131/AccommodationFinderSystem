# Accommodation Finder System
## SERVER: NODEJS EXPRESSJS - DATABASE: MONGODB
## CLIENT: REACTJS

### Cách làm việc trên branch cũ
1. `git stash` lưu trữ tạm thời dữ liệu ABC đã làm vào máy
2. `git checkout main` chuyển sang nhanh main
3. `git pull origin main` pull dữ liệu vào branch làm việc
4. `git checkout <tên nhánh>` về lại nhánh cũ
5. `git stash apply` lấy lại dữ liệu ABC vào branch làm việc
6. Tiếp tục làm việc trên branch
7. Commit và push code lên nhánh đã tạo `git push origin <tên nhánh>`
8. `git checkout main` + `git merger <tên nhánh>`
9. Truy cập vào github tạo pull request
10. Nhớ chuyển về branch hiện tại của mình.

### Cách làm việc trên branch mới
1. Pull dữ liệu mới nhất từ nhánh main `git pull origin main`
2. Tạo nhánh mới để làm việc theo quy tắc feature-<tên nhánh> `git branch feature-<tên nhánh>`
3. Chuyển sang nhánh đã tạo `git checkout feature-<tên nhánh>`
4. Làm việc trên nhánh đã tạo
5. Commit và push code lên nhánh đã tạo `git push origin feature-<tên nhánh>`

> Server
1. Config `.env`
2. `npm i` để cài đặt các thư viện còn thiếu
3. `npm run dev` để run server
> Client
1. Config `.env`
2. `npm i` để cài đặt các thư viện còn thiếu
3. `npm start` để run client
