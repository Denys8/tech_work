import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import Dropzone from "react-dropzone";
import filesize from "filesize";
import Spinner from "./spinner/Spinner";

import {
  PageLayout,
  Row,
  Col,
  Table,
  Button,
  Alert
} from "../../common/components/web";
import settings from "../../../../../../settings";

const UploadView = ({
  files,
  error,
  answer,
  loading,
  loading_spinner,
  handleUploadFiles,
  handleRemoveFile,
  t
}) => {
  const renderMetaData = () => {
    return (
      <Helmet
        title={`${settings.app.name} - ${t("title")}`}
        meta={[
          {
            name: "description",
            content: `${settings.app.name} - ${t("meta")}`
          }
        ]}
      />
    );
  };

  const columns = [
    {
      title: t("table.column.name"),
      dataIndex: "name",
      key: "name",
      render(text, record) {
        return (
          <a href={record.path} download={text}>
            {text} ({filesize(record.size)})
          </a>
        );
      }
    },
    {
      title: t("table.column.check"),
      dataIndex: "check",
      key: "check",
      render() {
        return <span>{answer.check}</span>;
      }
    },
    {
      title: t("table.column.supplier"),
      dataIndex: "supplier",
      key: "supplier",
      render() {
        return <span>{answer.supplier}</span>;
      }
    },
    {
      title: t("table.column.doc#"),
      dataIndex: "doc#",
      key: "doc#",
      render() {
        return <span>{answer.doc}</span>;
      }
    },
    {
      title: t("table.column.date"),
      dataIndex: "date",
      key: "date",
      render() {
        return <span>{answer.date}</span>;
      }
    },
    {
      title: t("table.column.status"),
      dataIndex: "status",
      key: "status",
      render() {
        return <span>{answer.status}</span>;
      }
    },
    {
      title: t("table.column.spinner"),
      dataIndex: "spinner",
      key: "spinner",
      render() {
        const loadingSpinner = loading_spinner ? <Spinner /> : null;
        return (
          <span>
            {loadingSpinner}
          </span>
        );
      }
    },
    {
      title: t("table.column.actions"),
      key: "actions",
      width: 50,
      render(text, record) {
        return (
          <Button
            color="primary"
            size="sm"
            className="delete-button"
            onClick={() => handleRemoveFile(record.id)}
          >
            {t("table.btnDel")}
          </Button>
        );
      }
    }
  ];

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center">
        <Row>
          <Col xs={3}>
            <Dropzone onDrop={handleUploadFiles}>
              <p>{t("message")}</p>
            </Dropzone>
          </Col>
          <Col xs={9}>
            {loading && <span>Loading...</span>}
            {error && <Alert color="error">{error}</Alert>}
            {files && <Table dataSource={files} columns={columns} />}
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
};

UploadView.propTypes = {
  files: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  handleUploadFiles: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default UploadView;
