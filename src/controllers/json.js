import jsonpatch from "jsonpatch";

export default (req, res, next) => {
  const { document, patch } = req.body;

  if (!document) {
    req.status = 400;
    return next(new Error("JSON object is required"));
  }

  if (!patch) {
    req.status = 400;
    return next(new Error("JSON patch is required"));
  }

  try {
    const patched = jsonpatch.apply_patch(document, patch);
    return res.status(201).send({ status: "Success", data: patched });
  } catch (error) {
    req.status = 400;
    return next(error);
  }
};
