namespace Microsoft.Crm.Sdk.Samples
{
    partial class WinCRUDOperations
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnExit = new System.Windows.Forms.Button();
            this.cbxServerList = new System.Windows.Forms.ComboBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.lblMulConn = new System.Windows.Forms.Label();
            this.lblOutMsg = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // btnExit
            // 
            this.btnExit.Location = new System.Drawing.Point(475, 323);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(75, 23);
            this.btnExit.TabIndex = 0;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = true;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // cbxServerList
            // 
            this.cbxServerList.FormattingEnabled = true;
            this.cbxServerList.Location = new System.Drawing.Point(30, 37);
            this.cbxServerList.Name = "cbxServerList";
            this.cbxServerList.Size = new System.Drawing.Size(436, 21);
            this.cbxServerList.TabIndex = 5;
            // 
            // btnConnect
            // 
            this.btnConnect.Location = new System.Drawing.Point(475, 37);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(75, 23);
            this.btnConnect.TabIndex = 6;
            this.btnConnect.Text = "Connect";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // lblMulConn
            // 
            this.lblMulConn.AutoSize = true;
            this.lblMulConn.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblMulConn.Location = new System.Drawing.Point(27, 9);
            this.lblMulConn.Name = "lblMulConn";
            this.lblMulConn.Size = new System.Drawing.Size(444, 17);
            this.lblMulConn.TabIndex = 7;
            this.lblMulConn.Text = "Choose a server configuration from the list, and then select [Connect]";
            // 
            // lblOutMsg
            // 
            this.lblOutMsg.BackColor = System.Drawing.Color.SeaShell;
            this.lblOutMsg.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.lblOutMsg.Location = new System.Drawing.Point(30, 73);
            this.lblOutMsg.Name = "lblOutMsg";
            this.lblOutMsg.Size = new System.Drawing.Size(520, 236);
            this.lblOutMsg.TabIndex = 8;
            // 
            // WinCRUDOperations
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(581, 373);
            this.Controls.Add(this.lblOutMsg);
            this.Controls.Add(this.lblMulConn);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.cbxServerList);
            this.Controls.Add(this.btnExit);
            this.Name = "WinCRUDOperations";
            this.Text = "QuickStart using Windows Forms";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnExit;
       
        private System.Windows.Forms.ComboBox cbxServerList;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.Label lblMulConn;
        private System.Windows.Forms.Label lblOutMsg;
    }
}