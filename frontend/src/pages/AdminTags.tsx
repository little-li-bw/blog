import AdminTaxonomyPage from '../components/admin/AdminTaxonomyPage';
import { createAdminTag, deleteAdminTag, getAdminTags } from '../api/adminTaxonomy';

export default function AdminTags() {
  return (
    <AdminTaxonomyPage
      title="标签管理"
      singularLabel="标签"
      nameLabel="标签名称"
      loadItems={getAdminTags}
      createItem={createAdminTag}
      deleteItem={deleteAdminTag}
    />
  );
}
