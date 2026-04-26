import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/common/Toast';
import subscriptionPlanApi, {
  SubscriptionPlan,
  SubscriptionPlanPayload,
} from '../../api/subscriptionPlanApi';

type FormState = {
  slug: string;
  name: string;
  description: string;
  price_monthly: string;
  price_yearly: string;
  artisan_commission_percent: string;
  job_proposal_limit: string;
  is_active: boolean;
  is_default: boolean;
  sort_order: string;
};

const emptyForm: FormState = {
  slug: '',
  name: '',
  description: '',
  price_monthly: '',
  price_yearly: '',
  artisan_commission_percent: '',
  job_proposal_limit: '',
  is_active: true,
  is_default: false,
  sort_order: '0',
};

const SubscriptionPlans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id),
    [plans]
  );

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await subscriptionPlanApi.getSubscriptionPlans();
      const data = response?.data ?? [];
      setPlans(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Failed to fetch subscription plans';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const openCreateForm = () => {
    setEditingPlanId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setForm({
      slug: plan.slug,
      name: plan.name,
      description: plan.description ?? '',
      price_monthly: String(plan.price_monthly),
      price_yearly: String(plan.price_yearly),
      artisan_commission_percent: String(plan.artisan_commission_percent),
      job_proposal_limit:
        plan.job_proposal_limit === null ||
        plan.job_proposal_limit === undefined
          ? ''
          : String(plan.job_proposal_limit),
      is_active: plan.is_active,
      is_default: plan.is_default,
      sort_order: String(plan.sort_order),
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPlanId(null);
    setForm(emptyForm);
  };

  const toPayload = (): SubscriptionPlanPayload => ({
    slug: form.slug.trim(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    price_monthly: Number(form.price_monthly),
    price_yearly: Number(form.price_yearly),
    artisan_commission_percent: Number(form.artisan_commission_percent),
    job_proposal_limit:
      form.job_proposal_limit.trim() === ''
        ? null
        : Number(form.job_proposal_limit),
    is_active: form.is_active,
    is_default: form.is_default,
    sort_order: Number(form.sort_order || '0'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const payload = toPayload();

      if (editingPlanId) {
        await subscriptionPlanApi.updateSubscriptionPlan(
          editingPlanId,
          payload
        );
        showToast('Subscription plan updated successfully', 'success');
      } else {
        await subscriptionPlanApi.createSubscriptionPlan(payload);
        showToast('Subscription plan created successfully', 'success');
      }

      closeForm();
      fetchPlans();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Unable to save subscription plan';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    if (!window.confirm(`Delete ${plan.name} plan?`)) return;

    try {
      await subscriptionPlanApi.deleteSubscriptionPlan(plan.id);
      showToast('Subscription plan deleted successfully', 'success');
      fetchPlans();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Unable to delete subscription plan';
      showToast(message, 'error');
    }
  };

  return (
    <div className="p-0">
      <div className="mb-4 sm:mb-6">
        <button
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back</span>
        </button>
      </div>

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Subscription Plans
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create, edit, and manage employer subscription plans.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="px-4 py-2.5 bg-[#A5EA91] hover:bg-[#95ddb1] text-[#174B35] rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-300">
            No subscription plans found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase">
                    Pricing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase">
                    Commission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase">
                    Job Proposal Limit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sortedPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {plan.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {plan.slug} {plan.is_default ? '• Default' : ''}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                      <div>
                        Monthly: ₦{Number(plan.price_monthly).toLocaleString()}
                      </div>
                      <div>
                        Yearly: ₦{Number(plan.price_yearly).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {Number(plan.artisan_commission_percent)}%
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {plan.job_proposal_limit === null ||
                      plan.job_proposal_limit === undefined
                        ? 'Unlimited'
                        : plan.job_proposal_limit}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          plan.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditForm(plan)}
                          className="p-2 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Edit plan"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="p-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {editingPlanId
                ? 'Edit Subscription Plan'
                : 'Create Subscription Plan'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Slug (e.g ruby)"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  required
                  placeholder="Plan Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Monthly Price"
                  value={form.price_monthly}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price_monthly: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Yearly Price"
                  value={form.price_yearly}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price_yearly: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Commission Percent"
                  value={form.artisan_commission_percent}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      artisan_commission_percent: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Job Proposal Limit (blank = unlimited)"
                  value={form.job_proposal_limit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      job_proposal_limit: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Sort Order"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, sort_order: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        is_default: e.target.checked,
                      }))
                    }
                  />
                  Default plan
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#A5EA91] text-[#174B35] font-medium disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingPlanId
                      ? 'Update Plan'
                      : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default SubscriptionPlans;
