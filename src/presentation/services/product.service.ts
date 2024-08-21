// import { ProductModel } from '../../data';
// import { CreateProductDto, CustomError, PaginationDto } from '../../domain';



// export class ProductService {

//     constructor(){}



//     async createProduct(createProductDto: CreateProductDto) {

//         const productExists = await ProductModel.findOne({name: createProductDto.name});
//         if(productExists) throw CustomError.badRequest('Product already exist');

//         try {
//             const product = new ProductModel(createProductDto);

//             await product.save();

//             return product;

//         } catch (error) {
//             throw CustomError.internalServer(`${error}`);
//         }
//     }

//     async getProducts(paginationDto: PaginationDto) {

//         const { page, limit } = paginationDto;

//         try {

//             const [total, products] = await Promise.all([
//                 ProductModel.countDocuments(),
//                 ProductModel.find()
//                 .skip((page-1)*limit)
//                 .limit(limit)
//                 .populate('category')
//                 .populate('user')
//             ]);
//             // const productsArr = products.map(product=> ({
//             //     id: product.id,
//             //     name: product.name,
//             //     available: product.available
//             // }));

//             return {
//                 page,
//                 limit,
//                 total,
//                 next: `/api/products?page=${(page+1)}&limit=${limit}`,
//                 prev: (page-1>0) ? `/api/products?page=${(page-1)}&limit=${limit}` : null,
//                 products
//             }

//         } catch (error) {
//             throw CustomError.internalServer(`${error}`);
//         }

//     }
// }
