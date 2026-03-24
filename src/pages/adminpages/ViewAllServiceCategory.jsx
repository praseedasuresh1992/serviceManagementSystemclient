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
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  const handleChange = (id, field, value) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat._id !== id) return cat;

        if (field === "full_day" || field === "half_day") {
          return {
            ...cat,
            basic_amount: {
              ...(cat.basic_amount || {}),
              [field]: value,
            },
          };
        }

        return {
          ...cat,
          [field]: value,
        };
      })
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
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Service Categories
      </h2>

      {message && (
        <div className="text-green-600 text-center mb-3 font-medium">
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-800 text-white text-center">
            <tr>
              <th className="px-4 py-2">Category Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Full Day Amount</th>
              <th className="px-4 py-2">Half Day Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="text-center border-t">
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={cat.category_name}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "category_name", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={cat.description}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "description", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={cat.basic_amount?.full_day || ""}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "full_day", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={cat.basic_amount?.half_day || ""}
                    disabled={editId !== cat._id}
                    onChange={(e) =>
                      handleChange(cat._id, "half_day", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2 space-y-2">
                  {editId === cat._id ? (
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded"
                      onClick={() => handleUpdate(cat)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
                      onClick={() => setEditId(cat._id)}
                    >
                      Update
                    </button>
                  )}

                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-1 rounded"
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