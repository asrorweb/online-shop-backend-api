import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  slug: { type: String, require: true },
  price: { type: Number, require: true, default: 0 },
  amount: { type: Number, require: true, default: 0 },
  image: {
    type: String,
    require: true,
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmsjchs.com%2F%25C3%2596verdel-till-pumptermosen-tillverkare-zojirushi-termosar-fr%25C3%25A5n-japanska-zojirushi-zz-JbmPn5Tn&psig=AOvVaw2q6GjMI1acpx8ansk0-aZ9&ust=1709400209984000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjfiJTK04QDFQAAAAAdAAAAABAe",
  },
  comments: [
    {
      author: { type: Schema.Types.ObjectId, ref: "User", required: true },
      comment: { type: String, require: true },
    },
  ],
});

const Product = model("Product", productSchema);

export default Product;
