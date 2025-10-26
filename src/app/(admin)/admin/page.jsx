import StatsSection from '@/components/admin/StatsSection';
import OrdersTable from '@/components/admin/OrdersTable';
import ProductsList from '@/components/admin/ProductsList';

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			<StatsSection />
			<OrdersTable />
			<ProductsList />
		</div>
	);
}