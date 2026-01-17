import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "AddedValue. - Admin",
    description: "AddedValue. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
