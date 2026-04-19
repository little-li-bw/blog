import AdminTaxonomyPage from '../components/admin/AdminTaxonomyPage';
import { createAdminCategory, deleteAdminCategory, getAdminCategories } from '../api/adminTaxonomy';

export default function AdminCategories() {
  return (
    <AdminTaxonomyPage
      title="分类管理"
      singularLabel="分类"
      nameLabel="分类名称"
      loadItems={getAdminCategories}
      createItem={createAdminCategory}
      deleteItem={deleteAdminCategory}
      showSort
    />
  );
}
