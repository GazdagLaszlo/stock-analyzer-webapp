import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: (form: ChangePasswordForm) => void;
};

export type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordModal = ({ open, onClose, onChange }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!open) {
      setForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [open]);

  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="card p-6">
          <h1 className="title is-4 mb-6">Change password</h1>
          <div className="field">
            <label className="label">Old password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                required
                value={form.oldPassword}
                onChange={(e) =>
                  setForm({ ...form, oldPassword: e.target.value })
                }
              />
            </div>
          </div>
          <div className="field">
            <label className="label">New password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                required
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Confirm Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>
          <div className="is-flex is-justify-content-center mt-6">
            <button
              className="button button-navy"
              type="button"
              onClick={() => {
                if (form.newPassword !== form.confirmPassword) {
                  enqueueSnackbar('Password do not match!', {
                    variant: 'warning',
                  });
                  return;
                }
                onChange(form);
              }}
            >
              Change password
            </button>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default ChangePasswordModal;
