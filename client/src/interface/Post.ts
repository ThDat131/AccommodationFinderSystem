export interface Post { 
    _id: string,
    name: string, 
    content: string, 
    price: number, 
    images: Array<any>,
    acreage: number,
    longitude: number, 
    latitude: number, 
    provinceId: string,
    districtId: string,
    wardId: string
    address: string, 
    userId: string, 
    categoryId: string
}