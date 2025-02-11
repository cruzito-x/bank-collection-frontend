import React, { useState } from "react";
import PaymentsCollectorsCharts from "../../charts/paymentsCollectors/PaymentsCollectorsCharts";
import { Button, Col, Modal, Row, Select, Space } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import moment from "moment";

const PaymentsCollectorsChartModal = ({ isOpen, isClosed }) => {
  const [dates, setDates] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const datesFilter = (filter) => {
    let range;

    switch (filter) {
      case "today":
        range = [moment().startOf("day"), moment().endOf("day")];
        break;
      case "lastWeek":
        range = [
          moment().subtract(7, "days").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastMonth":
        range = [
          moment().subtract(1, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastQuarter":
        range = [
          moment().subtract(3, "months").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastSemester":
        range = [
          moment().subtract(6, "months").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastYear":
        range = [
          moment().subtract(1, "year").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      default:
        range = [moment().startOf("day"), moment().endOf("day")];
    }

    setDates(range);
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <PieChartOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">
              Gráfica de Pagos Obtenidos por Colector
            </label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={900}
      onCancel={isClosed}
      footer={null}
    >
      <div className="row">
        <div className="col-12 w-auto">
          <label className="fw-semibold text-black me-2"> Fecha </label>
          <Space wrap>
            <Select
              className="mb-2"
              defaultValue="today"
              style={{
                width: 183,
              }}
              onChange={datesFilter}
              options={[
                {
                  value: "today",
                  label: "Hoy",
                },
                {
                  value: "lastWeek",
                  label: "Última Semana",
                },
                {
                  value: "lastMonth",
                  label: "Último Mes",
                },
                {
                  value: "lastQuarter",
                  label: "Últimos 3 Meses",
                },
                {
                  value: "lastSemester",
                  label: "Últimos 6 Meses",
                },
                {
                  value: "lastYear",
                  label: "Último Año",
                },
              ]}
            />
          </Space>
        </div>
      </div>
      <PaymentsCollectorsCharts isOpen={isOpen} dates={dates} />
      <div className="text-end mt-3">
        <Button type="primary" danger onClick={isClosed}>
          {" "}
          Cerrar{" "}
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentsCollectorsChartModal;
