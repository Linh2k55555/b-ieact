n = int(input("Nhập số lượng phần tử: "))
lst = []

for i in range(n):
    while True:
        num = int(input(f"Nhập số thứ {i+1}: "))
        if num > 0:
            lst.append(num)
            break
        else:
            print("Chỉ nhập số dương, vui lòng nhập lại!")

tong = sum(lst)
tong_le = sum(lst[1::2])  

print("Danh sách đã nhập:", lst)
print("Tổng các phần tử trong danh sách:", tong)
print("Tổng các số có chỉ số lẻ:", tong_le)
