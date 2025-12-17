import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";

const ViewAllServiceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/service-category");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (id, field, value) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === id
          ? {
              ...cat,
              basic_amount:
                field === "full_day" || field === "half_day"
                  ? { ...cat.basic_amount, [field]: value }
                  : cat.basic_amount,
              [field !== "full_day" && field !== "half_day" ? field : null]:
                field !== "full_day" && field !== "half_day" ? value : undefined,
            }
          : cat
      )
    );
  };

  const handleUpdate = async (category) => {
    try {
      await api.put(`/service-category/${category._id}`, {
        category_name: category.category_name,
        description: category.description,
        basic_amount: category.basic_amount,
      });
      setEditId(null);
      setMessage("Category updated successfully ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/service-category/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      alert("Category deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-5 bg-white shadow p-4 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Service Categories
      </h2>

      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Full Day Amount</th>
              <th>Half Day Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="text-center">
                <td>
                  <input
                    className="form-control"
                    value={cat.category_name}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "category_name", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="form-control"
                    value={cat.description}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "description", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={cat.basic_amount.full_day}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "full_day", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={cat.basic_amount.half_day}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "half_day", e.target.value)
                    }
                  />
                </td>

                <td className="space-y-2">
                  {editId === cat._id ? (
                    <button
                      className="btn btn-success btn-sm w-full"
                      onClick={() => handleUpdate(cat)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm w-full"
                      onClick={() => setEditId(cat._id)}
                    >
                      Update
                    </button>
                  )}

                  <button
                    className="btn btn-danger btn-sm w-full"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllServiceCategory;
