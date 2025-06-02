import ErrorAlert from "./ErrorAlert"
import SuccessAlert from "./SuccessAlert"

const AlertsSection = ({ error, successMessage }) => {
  if (!error && !successMessage) return null

  return (
    <div className="max-w-xl mx-auto mb-8">
      {error && <ErrorAlert text={error} />}
      {successMessage && <SuccessAlert text={successMessage} />}
    </div>
  )
}

export default AlertsSection