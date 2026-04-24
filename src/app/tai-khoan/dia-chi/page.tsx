// @ts-nocheck — Dead file: customer account removed (guest-only checkout)
"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/services/userService";
import type { Address, AddressType } from "@/types/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

type AddressFormData = {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  type: AddressType;
  isDefault: boolean;
};

const EMPTY_FORM: AddressFormData = {
  fullName: "",
  phone: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  type: "shipping",
  isDefault: false,
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch {
      setMessage({ type: "error", text: "Không thể tải danh sách địa chỉ." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setMessage(null);
  };

  const openEditForm = (addr: Address) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      ward: addr.ward,
      district: addr.district,
      city: addr.city,
      type: addr.type,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await createAddress({ ...form, latitude: null, longitude: null });
      }
      await loadAddresses();
      setShowForm(false);
      setMessage({
        type: "success",
        text: editingId ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ thành công!",
      });
    } catch {
      setMessage({ type: "error", text: "Không thể lưu địa chỉ. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setMessage({ type: "success", text: "Đã xóa địa chỉ." });
    } catch {
      setMessage({ type: "error", text: "Không thể xóa địa chỉ." });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
    } catch {
      setMessage({ type: "error", text: "Không thể đặt địa chỉ mặc định." });
    }
  };

  return (
    <div className="border-2 border-blue-1 rounded-[8px] overflow-hidden">
      <div className="bg-blue-1 px-4 py-3 flex items-center justify-between">
        <p className="text-white text-[16px] font-bold">Địa chỉ giao hàng</p>
        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 bg-white text-blue-main text-sm font-medium px-3 py-1.5 rounded-[6px] hover:bg-blue-50 transition-colors"
        >
          <Plus size={15} />
          Thêm địa chỉ
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-[8px] text-sm ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Address form */}
        {showForm && (
          <div className="mb-6 border border-blue-1 rounded-[8px] p-4">
            <p className="font-semibold text-main mb-4">
              {editingId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-main">
                    Họ và tên người nhận
                  </label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-main">
                    Số điện thoại
                  </label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0912345678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-main">
                  Địa chỉ cụ thể (số nhà, tên đường)
                </label>
                <Input
                  value={form.street}
                  onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                  placeholder="123 Đường ABC"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-main">
                    Tỉnh/Thành phố
                  </label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Hà Nội"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-main">
                    Quận/Huyện
                  </label>
                  <Input
                    value={form.district}
                    onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
                    placeholder="Cầu Giấy"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-main">
                    Phường/Xã
                  </label>
                  <Input
                    value={form.ward}
                    onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))}
                    placeholder="Dịch Vọng"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-main cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                    className="rounded"
                  />
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu địa chỉ"}
                </Button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-[6px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address list */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-1 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Bạn chưa có địa chỉ nào.</p>
            <button
              onClick={openAddForm}
              className="mt-3 text-blue-main text-sm hover:underline"
            >
              + Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border rounded-[8px] p-4 ${
                  addr.isDefault ? "border-blue-main bg-blue-50/30" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-main">{addr.fullName}</span>
                      <span className="text-gray-400 text-sm">|</span>
                      <span className="text-gray-600 text-sm">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="flex items-center gap-1 text-xs text-blue-main font-medium bg-blue-main/10 px-2 py-0.5 rounded-full">
                          <Star size={11} fill="currentColor" />
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs text-blue-main hover:underline"
                      >
                        Mặc định
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(addr)}
                      className="text-gray-400 hover:text-blue-main transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
