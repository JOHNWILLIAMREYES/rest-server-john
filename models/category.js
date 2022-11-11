const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  // data.uid = _id;
  return data;
};
module.exports = model("category", CategorySchema);
